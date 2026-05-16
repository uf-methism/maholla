const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.findFirst();
  console.log('Customer Location:', customer.latitude, customer.longitude);
  
  if (customer.latitude && customer.longitude) {
    console.log('Seeding vendors near this location...');
    await prisma.vendor.createMany({
      data: [
        {
          name: "Sharma Kirana Store",
          phone: "+919876543210",
          address: "Main Market Road",
          latitude: customer.latitude + 0.005,
          longitude: customer.longitude + 0.005,
        },
        {
          name: "Gupta General Store",
          phone: "+919876543211",
          address: "Station Road",
          latitude: customer.latitude - 0.003,
          longitude: customer.longitude + 0.002,
        },
        {
          name: "Verma Fresh Mart",
          phone: "+919876543212",
          address: "City Center",
          latitude: customer.latitude + 0.008,
          longitude: customer.longitude - 0.004,
        }
      ],
      skipDuplicates: true
    });
    console.log('Vendors seeded successfully!');
  }
}

main().finally(() => prisma.$disconnect());
