import prisma from '@/../prisma/client';
import { Role, UserStatus } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs'

export class CustomerSeedService {
  public async execute(): Promise<void> {
    console.log('Seeding CUSTOMER...');

    const plainPassword = 'customer@123#';
    const hashedPassword = await this.hashPassword(plainPassword);

    const customerData = [
      { name: 'Budi Santoso', email: 'budi@gmail.com', phone: '081300000001' },
      { name: 'Siti Aminah', email: 'siti@gmail.com', phone: '081300000002' },
      { name: 'Raka Pratama', email: 'raka@gmail.com', phone: '081300000003' },
      { name: 'Dewi Lestari', email: 'dewi@gmail.com', phone: '081300000004' },
      {
        name: 'Fajar Nugroho',
        email: 'fajar@gmail.com',
        phone: '081300000005',
      },
    ].map(customer => ({
      ...customer,
      password: hashedPassword,
      role: Role.customer,
      status: UserStatus.active,
      avatar: null,
    }));

    await prisma.user.createMany({
      data: customerData,
      skipDuplicates: true,
    });

    console.log(`${customerData.length} CUSTOMER created`);
    console.log(`Default password: ${plainPassword}`);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
}
