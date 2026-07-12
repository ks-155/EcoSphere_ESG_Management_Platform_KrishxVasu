import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const org = await prisma.organization.create({
    data: {
      name: 'EcoSphere Corp',
      slug: 'ecosphere-corp',
      logo: '/logos/ecosphere.png',
    },
  });

  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Information Technology',
        code: 'IT',
        description: 'Software development and infrastructure',
        headName: 'Alice Johnson',
        employeeCount: 45,
        status: true,
        organizationId: org.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Human Resources',
        code: 'HR',
        description: 'People management and culture',
        headName: 'Bob Smith',
        employeeCount: 12,
        status: true,
        organizationId: org.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Manufacturing',
        code: 'MFG',
        description: 'Production and operations',
        headName: 'Carol Williams',
        employeeCount: 120,
        status: true,
        organizationId: org.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Finance',
        code: 'FIN',
        description: 'Financial planning and accounting',
        headName: 'David Brown',
        employeeCount: 15,
        status: true,
        organizationId: org.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Marketing',
        code: 'MKT',
        description: 'Brand and communications',
        headName: 'Eva Davis',
        employeeCount: 20,
        status: true,
        organizationId: org.id,
      },
    }),
  ]);

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Energy', type: 'CSR_ACTIVITY', description: 'Energy management activities', status: true } }),
    prisma.category.create({ data: { name: 'Waste', type: 'CSR_ACTIVITY', description: 'Waste reduction programs', status: true } }),
    prisma.category.create({ data: { name: 'Water', type: 'CHALLENGE', description: 'Water conservation challenges', status: true } }),
    prisma.category.create({ data: { name: 'Community', type: 'CSR_ACTIVITY', description: 'Community engagement', status: true } }),
    prisma.category.create({ data: { name: 'Governance', type: 'CHALLENGE', description: 'Governance compliance challenges', status: true } }),
  ]);

  await prisma.emissionFactor.createMany({
    data: [
      { name: 'Natural Gas', category: 'Fuel', value: 2.0, unit: 'KG', source: 'EPA', validFrom: new Date('2024-01-01'), validTo: new Date('2025-12-31'), status: true },
      { name: 'Electricity (Grid)', category: 'Electricity', value: 0.5, unit: 'KWH', source: 'IEA', validFrom: new Date('2024-01-01'), validTo: new Date('2025-12-31'), status: true },
      { name: 'Diesel', category: 'Fuel', value: 2.7, unit: 'KG', source: 'EPA', validFrom: new Date('2024-01-01'), status: true },
      { name: 'Water Consumption', category: 'Water', value: 0.001, unit: 'LITER', source: 'Local', validFrom: new Date('2024-01-01'), status: true },
      { name: 'LPG', category: 'Gas', value: 1.5, unit: 'KG', source: 'EPA', validFrom: new Date('2024-06-01'), status: true },
    ],
  });

  await prisma.productProfile.createMany({
    data: [
      { name: 'Laptop Pro X1', sku: 'LPT-001', category: 'ELECTRONICS', carbonFootprint: 350.0, waterUsage: 5000.0, recyclable: true, complianceStatus: 'COMPLIANT', description: 'Business laptop', status: true },
      { name: 'Office Chair', sku: 'CHR-001', category: 'OTHER', carbonFootprint: 85.0, waterUsage: 1200.0, recyclable: true, complianceStatus: 'COMPLIANT', description: 'Ergonomic office chair', status: true },
      { name: 'Paper A4', sku: 'PAP-001', category: 'PACKAGING', carbonFootprint: 5.0, waterUsage: 50.0, recyclable: true, complianceStatus: 'PENDING', description: 'Recycled A4 paper', status: true },
      { name: 'Cleaning Solution', sku: 'CLN-001', category: 'CHEMICAL', carbonFootprint: 12.0, waterUsage: 200.0, recyclable: false, complianceStatus: 'NON_COMPLIANT', description: 'Industrial cleaning product', status: true },
    ],
  });

  await prisma.environmentalGoal.createMany({
    data: [
      { name: 'Reduce Carbon Emissions', description: 'Cut Scope 1+2 emissions by 20%', type: 'ENVIRONMENTAL', targetValue: 20, currentValue: 8, unit: '%', deadline: new Date('2025-12-31'), status: 'IN_PROGRESS', departmentId: departments[0].id, timeframe: 'ANNUAL' },
      { name: 'Zero Waste to Landfill', description: 'Achieve zero waste to landfill', type: 'ENVIRONMENTAL', targetValue: 100, currentValue: 45, unit: '%', deadline: new Date('2026-06-30'), status: 'IN_PROGRESS', timeframe: 'MULTI_YEAR' },
      { name: 'Water Reduction', description: 'Reduce water usage by 15%', type: 'ENVIRONMENTAL', targetValue: 15, currentValue: 0, unit: '%', deadline: new Date('2025-09-30'), status: 'NOT_STARTED', timeframe: 'QUARTERLY' },
    ],
  });

  await prisma.esgPolicy.createMany({
    data: [
      { title: 'Environmental Policy', description: 'Company environmental commitment', category: 'ENVIRONMENTAL', content: 'We are committed to reducing our environmental impact.', version: '1.0', status: 'ACTIVE', effectiveDate: new Date('2024-01-01') },
      { title: 'Code of Conduct', description: 'Ethical business practices', category: 'GOVERNANCE', content: 'All employees must follow the code of conduct.', version: '2.1', status: 'ACTIVE', effectiveDate: new Date('2024-03-01') },
      { title: 'Diversity & Inclusion', description: 'D&I policy', category: 'SOCIAL', content: 'We value diversity and foster inclusion.', version: '1.0', status: 'DRAFT', effectiveDate: new Date('2024-06-01') },
    ],
  });

  await prisma.badge.createMany({
    data: [
      { name: 'Eco Starter', description: 'Begin your sustainability journey', iconUrl: '/badges/eco-starter.png', category: 'ENVIRONMENTAL', unlockType: 'MANUAL', unlockValue: 0, xpReward: 50, status: true },
      { name: 'Green Champion', description: 'Complete 5 environmental challenges', iconUrl: '/badges/green-champion.png', category: 'ENVIRONMENTAL', unlockType: 'CHALLENGE_COUNT', unlockValue: 5, xpReward: 200, status: true },
      { name: 'CSR Hero', description: 'Participate in 10 CSR activities', iconUrl: '/badges/csr-hero.png', category: 'SOCIAL', unlockType: 'CHALLENGE_COUNT', unlockValue: 10, xpReward: 300, status: true },
    ],
  });

  await prisma.reward.createMany({
    data: [
      { name: 'Extra PTO Day', description: 'One additional paid time off day', imageUrl: '/rewards/pto.png', pointCost: 500, stock: 10, category: 'GENERAL', status: true },
      { name: 'Tree Planting Donation', description: 'Plant a tree in your name', imageUrl: '/rewards/tree.png', pointCost: 100, stock: 999, category: 'ENVIRONMENTAL', status: true },
      { name: 'Company Merch', description: 'Eco-friendly company merchandise', imageUrl: '/rewards/merch.png', pointCost: 250, stock: 50, category: 'GENERAL', status: true },
    ],
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecosphere.com',
      password: '$2b$10$w9PjbxmamVc6eVPFrZhJdOGg/Er4D3z/kBBtwl1QG8jD3i3Cez/s6',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      xp: 500,
      organizationId: org.id,
      departmentId: departments[0].id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'manager@ecosphere.com',
      password: '$2b$10$w9PjbxmamVc6eVPFrZhJdOGg/Er4D3z/kBBtwl1QG8jD3i3Cez/s6',
      name: 'ESG Manager',
      role: 'ESG_MANAGER',
      xp: 300,
      organizationId: org.id,
      departmentId: departments[2].id,
    },
  });

  console.log('Seed complete!');
  console.log(`  Organization: ${org.name}`);
  console.log(`  Departments: ${departments.length}`);
  console.log(`  Admin: admin@ecosphere.com / admin123`);
  console.log(`  Manager: manager@ecosphere.com / password`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
