import 'dotenv/config';
import prisma from './src/config/prismaClient';

async function main() {
  const customer = await prisma.customer.findFirst({
    where: { latitude: { not: null } },
    orderBy: { updatedAt: 'desc' }
  });
  
  if (!customer) {
    console.log('No customer found in the database. Please send a message from WhatsApp first.');
    return;
  }

  console.log('Customer Location:', customer.latitude, customer.longitude);
  
  if (customer.latitude && customer.longitude) {
    console.log('Seeding vendors near this location...');
    
    const vendors = [
      {
        name: "Sharma Kirana Store",
        phone: "+919800000001",
        address: "Salisbury Park Main Road",
        latitude: customer.latitude + 0.005,
        longitude: customer.longitude + 0.005,
      },
      {
        name: "Gupta General Store",
        phone: "+919800000002",
        address: "Station Road, Near Water Tank",
        latitude: customer.latitude - 0.003,
        longitude: customer.longitude + 0.002,
      },
      {
        name: "Verma Fresh Mart",
        phone: "+919800000003",
        address: "City Center Square",
        latitude: customer.latitude + 0.008,
        longitude: customer.longitude - 0.004,
      }
    ];

    for (const v of vendors) {
      await prisma.vendor.upsert({
        where: { phone: v.phone },
        update: {},
        create: v,
      });
    }

    console.log('Vendors seeded successfully! You can now send a message to browse them.');
  } else {
    console.log('Customer has no location saved yet.');
  }
}

main().finally(() => prisma.$disconnect());
