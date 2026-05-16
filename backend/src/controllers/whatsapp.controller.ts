import { Request, Response } from 'express';
import { whatsappService } from '../services/whatsapp.service';
import { vendorService } from '../services/vendor.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import prisma from '../config/prismaClient';
import { geminiService } from '../ai/gemini.service';
import { inventoryService } from '../services/inventory.service';

/**
 * GET /api/v1/whatsapp/webhook
 * Simple health check for the webhook endpoint.
 */
export const verifyWebhook = (req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', message: 'WhatsApp webhook is active' });
};

/**
 * POST /api/v1/whatsapp/webhook
 * Receives incoming WhatsApp messages from Twilio.
 */
export const handleIncomingMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const body = req.body;

    console.log('📨 Twilio webhook received:', {
      from: body.From,
      body: body.Body,
      lat: body.Latitude,
      lng: body.Longitude,
    });

    const rawPhone = (body.From as string) ?? '';
    const senderPhone = rawPhone.replace('whatsapp:', '');
    const messageBody = (body.Body as string)?.trim() ?? '';
    const messageSid = (body.MessageSid as string) ?? `twilio_${Date.now()}`;
    const senderName = (body.ProfileName as string) ?? 'Unknown';

    const latitude = body.Latitude ? parseFloat(body.Latitude) : null;
    const longitude = body.Longitude ? parseFloat(body.Longitude) : null;

    if (!senderPhone) {
      res.status(200).send('OK');
      return;
    }

    try {
      // Find or create customer
      let customer = await prisma.customer.findUnique({
        where: { phone: senderPhone },
        include: { activeVendor: true },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: { name: senderName, phone: senderPhone },
          include: { activeVendor: true },
        });
        console.log(`👤 New customer created: ${senderName}`);
      }

      // Save the inbound message
      await prisma.whatsAppMessage.create({
        data: {
          messageId: messageSid,
          customerId: customer.id,
          body: latitude && longitude ? `[Location: ${latitude}, ${longitude}]` : messageBody,
          direction: 'INBOUND',
        },
      });

      // --- COMMANDS ---
      const lowerBody = messageBody.toLowerCase();
      if (lowerBody === 'exit') {
        if (customer.activeVendorId) {
          await prisma.customer.update({
            where: { id: customer.id },
            data: { activeVendorId: null, sessionExpiresAt: null },
          });
          await whatsappService.sendMessage(rawPhone, `✅ You have disconnected from ${customer.activeVendor?.name}. Send any message to browse vendors again.`);
        } else {
          await whatsappService.sendMessage(rawPhone, `You are not currently connected to any vendor.`);
        }
        res.status(200).send('OK');
        return;
      }

      if (lowerBody === 'change location') {
        await prisma.customer.update({
          where: { id: customer.id },
          data: { latitude: null, longitude: null, activeVendorId: null },
        });
        await whatsappService.sendMessage(rawPhone, `📍 Please share your new location using the WhatsApp attachment button (📎 -> Location).`);
        res.status(200).send('OK');
        return;
      }

      // --- STATE 1: ACTIVE SESSION ---
      if (customer.activeVendorId && customer.sessionExpiresAt && new Date() < customer.sessionExpiresAt) {
        
        // UX Improvement: Tell the user we are thinking (Twilio fires this instantly)
        await whatsappService.sendMessage(rawPhone, `⏳ _Processing your message..._`);

        const currentCart = customer.draftOrder ? (customer.draftOrder as any).items || [] : [];
        const aiResponse = await geminiService.classifyIntent(currentCart, messageBody);

        let shouldContinue = false;
        
        switch (aiResponse.intent) {
          case 'CONFIRM_ORDER': {
            const cart = currentCart;
            if (cart.length === 0) {
              await whatsappService.sendMessage(rawPhone, `Your cart is empty. Please add items before confirming.`);
              break;
            }

            let totalAmount = 0;
            cart.forEach((item: any) => { totalAmount += (item.price || 0) * item.quantity; });

            const order = await prisma.order.create({
              data: {
                customerId: customer.id,
                vendorId: customer.activeVendorId,
                status: 'PENDING',
                totalAmount,
                orderItems: {
                  create: cart.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.price || 0
                  }))
                }
              }
            });

            for (const item of cart) {
              await prisma.product.update({
                where: { id: item.productId },
                data: { stockQuantity: { decrement: item.quantity } }
              });
            }

            await prisma.customer.update({
              where: { id: customer.id },
              data: { orderState: null, draftOrder: null }
            });

            await whatsappService.sendMessage(rawPhone, `✅ **Order Placed Successfully!**\nOrder ID: #${order.id.slice(0, 5).toUpperCase()}\nTotal: ₹${totalAmount}\n\n${customer.activeVendor?.name} has received your order and will prepare it soon.`);
            break;
          }

          case 'CHANGE_STORE': {
            const oldVendorName = customer.activeVendor?.name || 'the store';
            customer = await prisma.customer.update({
              where: { id: customer.id },
              data: { activeVendorId: null, sessionExpiresAt: null, orderState: null, draftOrder: null },
            });
            await whatsappService.sendMessage(rawPhone, `✅ You have left ${oldVendorName}.`);
            shouldContinue = true;
            break;
          }

          case 'CALL_STORE': {
            await whatsappService.sendMessage(rawPhone, `📞 You can contact **${customer.activeVendor?.name}** at: ${customer.activeVendor?.phone}`);
            break;
          }

          case 'CHANGE_LOCATION': {
            customer = await prisma.customer.update({
              where: { id: customer.id },
              data: { latitude: null, longitude: null, activeVendorId: null, sessionExpiresAt: null },
            });
            await whatsappService.sendMessage(rawPhone, `📍 Please share your new location using the WhatsApp attachment button (📎 -> Location).`);
            shouldContinue = true;
            break;
          }

          case 'SHOW_CART':
          case 'UPDATE_CART': {
            const parsedItems = aiResponse.intent === 'UPDATE_CART' ? aiResponse.payload || [] : currentCart;
            
            if (parsedItems.length === 0) {
              await prisma.customer.update({
                where: { id: customer.id },
                data: { orderState: null, draftOrder: null }
              });
              await whatsappService.sendMessage(rawPhone, `🛒 Your cart is currently empty.`);
              break;
            }

            const matchedItems = await inventoryService.matchItemsWithInventory(customer.activeVendorId, parsedItems);
            
            let reply = `🛒 **Your Cart:**\n`;
            const available: any[] = [];
            const unavailable: any[] = [];
            let total = 0;
            
            matchedItems.forEach(item => {
                if (item.isAvailable) {
                    available.push(item);
                    total += (item.price || 0) * item.quantity;
                    reply += `- ${item.matchedName} (${item.quantity} ${item.unit}) - ₹${(item.price || 0) * item.quantity}\n`;
                } else {
                    unavailable.push(item);
                }
            });
            
            if (unavailable.length > 0) {
                reply += `\n❌ **Out of Stock or Not Found:**\n`;
                unavailable.forEach(item => {
                    reply += `- ${item.name} (${item.quantity} ${item.unit})\n`;
                });
            }
            
            if (available.length > 0) {
                reply += `\n**Estimated Total:** ₹${total}\n\nReply *CONFIRM* to place order, or simply type to add/remove items (e.g. "remove maggi").`;
            } else {
                reply += `\nPlease try requesting other items.`;
            }
            
            await prisma.customer.update({
                where: { id: customer.id },
                data: {
                    orderState: 'CONFIRMING_CART',
                    draftOrder: { items: available }
                }
            });
            
            await whatsappService.sendMessage(rawPhone, reply);
            break;
          }

          case 'GENERAL_CHAT':
          default: {
            await whatsappService.sendMessage(rawPhone, `I didn't quite get that. You can:\n- List grocery items to add/remove\n- Say "confirm" to place order\n- Say "change store" or "call store"\n- Ask "show my cart"`);
            break;
          }
        }

        if (!shouldContinue) {
          res.status(200).send('OK');
          return;
        }
      }

      // If session expired, clear it
      if (customer.activeVendorId && customer.sessionExpiresAt && new Date() >= customer.sessionExpiresAt) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { activeVendorId: null, sessionExpiresAt: null },
          include: { activeVendor: true },
        });
        await whatsappService.sendMessage(rawPhone, `Your session expired. Let's find a vendor.`);
      }

      // --- STATE 2: AWAITING LOCATION ---
      if (!customer.latitude || !customer.longitude) {
        if (latitude && longitude) {
          // Save location
          customer = await prisma.customer.update({
            where: { id: customer.id },
            data: { latitude, longitude },
            include: { activeVendor: true },
          });
          await whatsappService.sendMessage(rawPhone, `📍 Location saved! Searching for nearby vendors...`);
        } else {
          // Ask for location
          await whatsappService.sendMessage(rawPhone, `👋 Welcome to Mohalla!\n\nPlease share your location using the WhatsApp attachment button (📎 -> Location) to find nearby vendors.`);
          res.status(200).send('OK');
          return;
        }
      }

      // --- STATE 3: BROWSING VENDORS ---
      // Fetch vendors within 2.5km
      const vendorsData = await vendorService.getNearbyVendors(
        customer.latitude!,
        customer.longitude!,
        2.5,
        undefined,
        { page: 1, limit: 5 }
      );
      
      const nearbyVendors = vendorsData.vendors;

      if (nearbyVendors.length === 0) {
        await whatsappService.sendMessage(rawPhone, `Sorry, we couldn't find any vendors within 2.5km of your location.\nType 'CHANGE LOCATION' to try a different spot.`);
        res.status(200).send('OK');
        return;
      }

      // If user typed a number, select the vendor
      const selectedIndex = parseInt(messageBody) - 1;
      if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < nearbyVendors.length) {
        const selectedVendor = nearbyVendors[selectedIndex];
        
        // Connect them (Session expires at end of day tomorrow)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        expiresAt.setHours(23, 59, 59, 999);

        await prisma.customer.update({
          where: { id: customer.id },
          data: { 
            activeVendorId: selectedVendor.id,
            lastSelectedVendorId: selectedVendor.id,
            sessionExpiresAt: expiresAt
          },
        });

        await whatsappService.sendMessage(rawPhone, `✅ You are now connected to *${selectedVendor.name}*!\n\nSend your order list (e.g. "1 kg aalu aur 2 packet maggi").\n\nType 'EXIT' to disconnect.`);
        res.status(200).send('OK');
        return;
      }

      // Sort vendors (put last selected on top)
      if (customer.lastSelectedVendorId) {
        nearbyVendors.sort((a, b) => {
          if (a.id === customer.lastSelectedVendorId) return -1;
          if (b.id === customer.lastSelectedVendorId) return 1;
          return 0;
        });
      }

      // Display vendor list
      let menu = `Found ${nearbyVendors.length} vendors nearby. Reply with the number to connect:\n\n`;
      nearbyVendors.forEach((v, idx) => {
        const dist = v.distance ? `(${v.distance.toFixed(1)}km)` : '';
        menu += `${idx + 1}. *${v.name}* ${dist}\n`;
      });
      menu += `\nType 'CHANGE LOCATION' to update your location.`;

      await whatsappService.sendMessage(rawPhone, menu);

    } catch (err) {
      console.error('❌ Error processing message:', err);
    }

    res.status(200).send('OK');
  }
);
