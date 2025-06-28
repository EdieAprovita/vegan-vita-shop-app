import { PrismaClient, UserRole, OrderStatus, PaymentMethod } from './generated';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@veganvitashop.com' },
      update: {},
      create: {
        email: 'admin@veganvitashop.com',
        name: 'Admin User',
        password: hashedPassword,
        role: UserRole.ADMIN,
        emailVerified: new Date(),
      },
    });

    // Create test user
    const testUserPassword = await bcrypt.hash('test123', 12);
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: testUserPassword,
        role: UserRole.USER,
        emailVerified: new Date(),
      },
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'vegetables' },
        update: {},
        create: {
          name: 'Fresh Vegetables',
          slug: 'vegetables',
          description: 'Fresh, organic vegetables',
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'fruits' },
        update: {},
        create: {
          name: 'Fresh Fruits',
          slug: 'fruits',
          description: 'Fresh, seasonal fruits',
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'grains' },
        update: {},
        create: {
          name: 'Whole Grains',
          slug: 'grains',
          description: 'Organic whole grains and legumes',
          isActive: true,
        },
      }),
      prisma.category.upsert({
        where: { slug: 'supplements' },
        update: {},
        create: {
          name: 'Supplements',
          slug: 'supplements',
          description: 'Vegan health supplements',
          isActive: true,
        },
      }),
    ]);

    // Create products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { sku: 'VEG-TOM-001' },
        update: {},
        create: {
          name: 'Organic Tomatoes',
          description: 'Fresh, organic tomatoes grown locally. Perfect for salads, cooking, and sauces.',
          price: 4.99,
          sku: 'VEG-TOM-001',
          stock: 50,
          images: ['/images/products/tomatoes.jpg'],
          categoryId: categories[0].id,
          tags: ['organic', 'fresh', 'local'],
          isActive: true,
          isFeatured: true,
        },
      }),
      prisma.product.upsert({
        where: { sku: 'FRU-APP-001' },
        update: {},
        create: {
          name: 'Organic Apples',
          description: 'Crisp and sweet organic apples. Great for snacking and baking.',
          price: 6.99,
          discountPrice: 5.99,
          sku: 'FRU-APP-001',
          stock: 75,
          images: ['/images/products/apples.jpg'],
          categoryId: categories[1].id,
          tags: ['organic', 'sweet', 'crisp'],
          isActive: true,
          isFeatured: true,
        },
      }),
      prisma.product.upsert({
        where: { sku: 'GRA-QUI-001' },
        update: {},
        create: {
          name: 'Organic Quinoa',
          description: 'Premium organic quinoa. High in protein and perfect for healthy meals.',
          price: 12.99,
          sku: 'GRA-QUI-001',
          stock: 30,
          images: ['/images/products/quinoa.jpg'],
          categoryId: categories[2].id,
          tags: ['organic', 'protein', 'gluten-free'],
          isActive: true,
          isFeatured: false,
        },
      }),
      prisma.product.upsert({
        where: { sku: 'SUP-B12-001' },
        update: {},
        create: {
          name: 'Vegan B12 Supplement',
          description: 'Essential B12 vitamin supplement for vegans. 60 capsules.',
          price: 24.99,
          discountPrice: 19.99,
          sku: 'SUP-B12-001',
          stock: 100,
          images: ['/images/products/b12-supplement.jpg'],
          categoryId: categories[3].id,
          tags: ['vegan', 'vitamin', 'health'],
          isActive: true,
          isFeatured: true,
        },
      }),
    ]);

    // Create sample order
    const sampleOrder = await prisma.order.create({
      data: {
        userId: testUser.id,
        status: OrderStatus.DELIVERED,
        itemsPrice: 11.98,
        taxPrice: 1.20,
        shippingPrice: 5.99,
        totalPrice: 19.17,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: true,
        deliveredAt: new Date(),
        paymentMethod: PaymentMethod.CREDIT_CARD,
        shippingAddress: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94101',
          country: 'USA',
        },
        orderItems: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: 4.99,
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: 5.99,
            },
          ],
        },
      },
    });

    // Create sample reviews
    await Promise.all([
      prisma.review.create({
        data: {
          userId: testUser.id,
          productId: products[0].id,
          rating: 5,
          comment: 'Fresh and delicious tomatoes! Will order again.',
        },
      }),
      prisma.review.create({
        data: {
          userId: testUser.id,
          productId: products[1].id,
          rating: 4,
          comment: 'Great apples, very crisp and sweet.',
        },
      }),
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created:`);
    console.log(`- ${categories.length} categories`);
    console.log(`- ${products.length} products`);
    console.log(`- 2 users (admin & test)`);
    console.log(`- 1 sample order`);
    console.log(`- 2 product reviews`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};