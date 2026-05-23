const { prisma } = require('../src/config/db');
const bcrypt = require('bcrypt');

async function main() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Use Prisma upsert to create or update admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@tropipine.com' },
      update: { password: passwordHash },
      create: {
        name: 'Super Admin',
        email: 'admin@tropipine.com',
        password: passwordHash,
        role: 'SUPER_ADMIN',
      },
    });
    
    console.log('✅ Admin user created/updated with password: admin123');

    const products = [
      {
        name: 'Haribhanga Mango',
        slug: 'haribhanga-mango',
        description: 'Premium Haribhanga mango — sweet and aromatic.',
        basePrice: 250,
        finalPrice: 250,
        stockQty: 100,
        origin: 'Rajshahi',
        isFeatured: true,
        isExclusive: true,
        exclusiveLabel: 'Haribhanga',
      },
      {
        name: 'Gopalbhog Mango',
        slug: 'gopalbhog-mango',
        description: 'Gopalbhog mango — rich flavor, limited season.',
        basePrice: 220,
        finalPrice: 220,
        stockQty: 80,
        origin: 'Chapainawabganj',
        isFeatured: true,
        isExclusive: true,
        exclusiveLabel: 'Gopalbhog',
      },
      {
        name: 'TropiPine Pineapple',
        slug: 'tropipine-pineapple',
        description: 'Fresh pineapple from local farms.',
        basePrice: 120,
        finalPrice: 120,
        stockQty: 150,
        isFeatured: true,
        isBestSeller: true,
      },
    ];

    for (const p of products) {
      try {
        await prisma.product.create({ data: p });
      } catch (e) {
        console.log(`Product ${p.slug} already exists`);
      }
    }

    try {
      await prisma.siteSettings.create({ data: { key: 'bkash_number', value: '01XXXXXXXXX' } });
    } catch (e) {}
    try {
      await prisma.siteSettings.create({ data: { key: 'nagad_number', value: '01XXXXXXXXX' } });
    } catch (e) {}
    try {
      await prisma.siteSettings.create({ data: { key: 'rocket_number', value: '01XXXXXXXXX' } });
    } catch (e) {}

    console.log('✅ Seed data created');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
