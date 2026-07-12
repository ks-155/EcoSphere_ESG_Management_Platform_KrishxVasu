import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingOrg = await prisma.organization.findUnique({ where: { slug: 'ecosphere' } });
  if (existingOrg) {
    console.log('Seed data already exists, skipping...');
    return;
  }

  const org = await prisma.organization.create({
    data: {
      name: 'EcoSphere Corp',
      slug: 'ecosphere',
      esgWeightE: 40,
      esgWeightS: 30,
      esgWeightG: 30,
      autoCalcEmission: true,
      autoAwardBadge: true,
      evidenceRequired: true,
    },
  });

  console.log('Created organization:', org.id);

  const deptData = [
    { name: 'Information Technology', code: 'IT' },
    { name: 'Human Resources', code: 'HR' },
    { name: 'Manufacturing', code: 'MFG' },
    { name: 'Finance', code: 'FIN' },
    { name: 'Marketing', code: 'MKT' },
  ];

  const departmentIds: string[] = [];
  for (const d of deptData) {
    const dept = await prisma.department.create({
      data: { name: d.name, code: d.code, employeeCount: 10, organizationId: org.id },
    });
    departmentIds.push(dept.id);
    console.log('Created department:', dept.name);
  }

  const catData = [
    { name: 'Environment', type: 'CSR_ACTIVITY' as const },
    { name: 'Health', type: 'CSR_ACTIVITY' as const },
    { name: 'Education', type: 'CSR_ACTIVITY' as const },
    { name: 'Energy Saving', type: 'CHALLENGE' as const },
    { name: 'Waste Management', type: 'CHALLENGE' as const },
  ];

  for (const c of catData) {
    await prisma.category.create({ data: { name: c.name, type: c.type } });
    console.log('Created category:', c.name);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecosphere.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      organizationId: org.id,
      departmentId: departmentIds[0],
    },
  });

  console.log('Created admin user:', admin.email);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
