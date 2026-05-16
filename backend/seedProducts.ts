import 'dotenv/config';
import prisma from './src/config/prismaClient';

async function main() {
  const vendors = await prisma.vendor.findMany();
  
  if (vendors.length === 0) {
    console.log('No vendors found in DB. Run seedVendors.js first.');
    return;
  }

  for (const vendor of vendors) {
    const vendorId = vendor.id;
    console.log(`Seeding products for vendor: ${vendor.name} (${vendorId})`);
    
    const products = [
      { name: "Aalu (Potato)", price: 40, stockQuantity: 50, vendorId },
      { name: "Pyaaz (Onion)", price: 50, stockQuantity: 30, vendorId },
      { name: "Maggi 2-Minute Noodles Packet", price: 14, stockQuantity: 100, vendorId },
      { name: "Aashirvaad Atta 5kg", price: 210, stockQuantity: 20, vendorId },
      { name: "Amul Milk 1L", price: 66, stockQuantity: 10, vendorId },
      { name: "Tata Salt 1kg", price: 28, stockQuantity: 40, vendorId },
      { name: "Tamatar (Tomato)", price: 30, stockQuantity: 45, vendorId },
      { name: "Aam (Mango)", price: 120, stockQuantity: 15, vendorId },
    ];

    for (const p of products) {
      const existing = await prisma.product.findFirst({
        where: { vendorId: p.vendorId, name: p.name }
      });
      
      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: p
        });
      } else {
        await prisma.product.create({ data: p });
      }
    }
  }

  console.log('Dummy products seeded successfully to all vendors!');
}

main().finally(() => prisma.$disconnect());
