"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Clean existing data (optional, but good for idempotent seeds in dev)
    // Warning: Be careful with this in production
    await prisma.inventoryLog.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.review.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.vendor.deleteMany();
    // 1. Create Vendors
    console.log('Creating Vendors...');
    const vendor1 = await prisma.vendor.create({
        data: {
            name: 'Sharma Kirana Store',
            phone: '+919876543210',
            address: '123 Main Street, Sector 4, Locality A',
            latitude: 28.6139,
            longitude: 77.2090,
        },
    });
    const vendor2 = await prisma.vendor.create({
        data: {
            name: 'Gupta General Store',
            phone: '+919876543211',
            address: '45 Market Road, Sector 5, Locality A',
            latitude: 28.6145,
            longitude: 77.2085,
        },
    });
    const vendor3 = await prisma.vendor.create({
        data: {
            name: 'Verma Vegetables',
            phone: '+919876543212',
            address: '78 Subzi Mandi, Sector 4, Locality A',
            latitude: 28.6135,
            longitude: 77.2095,
        },
    });
    // 2. Create Products
    console.log('Creating Products...');
    const productsToCreate = [
        { vendorId: vendor1.id, name: 'Aashirvaad Atta 5kg', price: 210, stockQuantity: 50 },
        { vendorId: vendor1.id, name: 'Tata Salt 1kg', price: 25, stockQuantity: 100 },
        { vendorId: vendor1.id, name: 'Maggi 2-Minute Noodles', price: 14, stockQuantity: 200 },
        { vendorId: vendor2.id, name: 'Amul Butter 100g', price: 54, stockQuantity: 30 },
        { vendorId: vendor2.id, name: 'Parle-G Biscuits', price: 10, stockQuantity: 150 },
        { vendorId: vendor3.id, name: 'Potatoes 1kg', price: 30, stockQuantity: 100 },
        { vendorId: vendor3.id, name: 'Onions 1kg', price: 40, stockQuantity: 80 },
    ];
    const createdProducts = [];
    for (const p of productsToCreate) {
        createdProducts.push(await prisma.product.create({ data: p }));
    }
    // 3. Create Customers
    console.log('Creating Customers...');
    const customer1 = await prisma.customer.create({
        data: {
            name: 'Rahul Kumar',
            phone: '+919998887776',
            address: 'A-101, Residency Flats, Sector 4',
            latitude: 28.6140,
            longitude: 77.2088,
        },
    });
    const customer2 = await prisma.customer.create({
        data: {
            name: 'Priya Singh',
            phone: '+919998887775',
            address: 'B-202, Residency Flats, Sector 5',
            latitude: 28.6148,
            longitude: 77.2080,
        },
    });
    // 4. Create an Order
    console.log('Creating Orders...');
    const order1 = await prisma.order.create({
        data: {
            customerId: customer1.id,
            vendorId: vendor1.id,
            status: 'COMPLETED',
            totalAmount: 235,
            notes: 'Please pack well',
            orderItems: {
                create: [
                    {
                        productId: createdProducts[0].id, // Aashirvaad Atta
                        quantity: 1,
                        unitPrice: 210,
                    },
                    {
                        productId: createdProducts[1].id, // Tata Salt
                        quantity: 1,
                        unitPrice: 25,
                    },
                ],
            },
        },
    });
    // 5. Create Inventory Logs
    console.log('Creating Inventory Logs...');
    await prisma.inventoryLog.create({
        data: {
            productId: createdProducts[0].id,
            previousStock: 51,
            newStock: 50,
            reason: 'SALE',
        },
    });
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map