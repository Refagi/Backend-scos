import prisma from '@/../prisma/client'
import { Role, UserStatus } from '@/generated/prisma/client'

export class SellerSeedService {
  public async execute(): Promise<void> {
    console.log('Seeding SELLER...')

    const plainPassword = 'seller@123#'
    const hashedPassword = await this.hashPassword(plainPassword)

    const sellerData = [
      { name: 'Umi Atik',         email: 'umi@gmail.com',            phone: '081200000002', storeName: 'Kantin Dapur Umi Atik',          location: 'Gedung A - Lantai 1', isOpen: true, openLabel: 'Tutup jam 12.00', status: UserStatus.non_active, image: '/kantinDapurUmmi/tenant/kantinDapurUmmi.png'},
      { name: 'Teh Nua',          email: 'nua@gmail.com',            phone: '081200000003', storeName: 'Kantin Teh Nua',                 location: 'Gedung A - Lantai 1', isOpen: true, openLabel: 'Buka hingga 13.30', status: UserStatus.active,     image: '/kantinTehNua/tenant/kantinTehNua.png', qrisImage: '/kantinTehNua/qris/qris_kantintehnua.png' },
      { name: 'Pak Budi',         email: 'budi@gmail.com',           phone: '081200000004', storeName: 'Kantin Kabel Lamongan',           location: 'Gedung B - Lantai 1', isOpen: true, openLabel: 'Buka hingga 15.30', status: UserStatus.active, image: '/kantinKabelLamongan/tenant/kantinlamongan.png' },
      { name: 'Bunda Rayyan',     email: 'bundarayyan@gmail.com',    phone: '081200000005', storeName: 'Cemal Cemil Kabel Bunda Rayyan', location: 'Gedung B - Lantai 2', isOpen: true, openLabel: 'Buka hingga 16.00', status: UserStatus.active,     image: '/cemalcemilkabelbundarayyan/tenant/cemalcemil.png', qrisImage: '/cemalcemilkabelbundarayyan/qris/qris_cemalcemilbundarayyan.png' },
      { name: 'Al Arfa',          email: 'arfa@gmail.com',           phone: '081200000006', storeName: 'Kantin Al-Arfa',                 location: 'Gedung C - Lantai 1', isOpen: true, openLabel: 'Buka hingga 16.00', status: UserStatus.non_active, image: '/kantinAlArfa/tenant/kantinAlarfa.png', qrisImage: '/kantinAlArfa/qris/qris_kantinalarfa.png' },
      { name: 'Bu Yum',           email: 'yum@gmail.com',            phone: '081200000007', storeName: 'Kantin Bu Yum',                  location: 'Gedung C - Lantai 1', isOpen: true, openLabel: 'Buka hingga 15.30', status: UserStatus.active,     image: '/kantinIbuYum/tenant/kantinBuYum.png', qrisImage: '/kantinIbuYum/qris/qris_kantinibuyum.png' },
      { name: 'Fajri',            email: 'fajri@gmail.com',          phone: '081200000008', storeName: 'Kantin Fajri',                   location: 'Gedung C - Lantai 2', isOpen: true, openLabel: 'Buka hingga 14.00', status: UserStatus.active,     image: '/KantinFajri/tenant/kantinFajri.png', qrisImage: '/KantinFajri/qris/qris_kantinfajri.png' },
      { name: 'Hj Rohani',        email: 'rohani@gmail.com',         phone: '081200000009', storeName: 'Kantin Ayam Bakar Bu Hj Rohani', location: 'Gedung D - Lantai 1', isOpen: true, openLabel: 'Buka hingga 13.00', status: UserStatus.non_active, image: '/ayamBakarBuHjRohani/tenant/kantinHjRohani.png' },
      { name: 'Pak Udin',         email: 'udin@gmail.com',           phone: '081200000010', storeName: 'Kantin Pak Udin',                location: 'Gedung D - Lantai 1', isOpen: true, openLabel: 'Buka hingga 15.00', status: UserStatus.active,     image: '/kantinPakUdin/tenant/kantinPakUdin.png', qrisImage: '/kantinPakUdin/qris/qris_kantinpakudin.png' },
      { name: 'Bunda',            email: 'bunda@gmail.com',          phone: '081200000011', storeName: 'Kantin Bunda',                   location: 'Gedung D - Lantai 2', isOpen: true, openLabel: 'Buka hingga 16.00', status: UserStatus.active,     image: '/kantinBunda/tenant/kantinBunda.png', qrisImage: '/kantinBunda/qris/qris_kantinbunda.png' },
      { name: 'Grobak Hayam',     email: 'hayam@gmail.com',          phone: '081200000014', storeName: 'Grobak Hayam',                   location: 'Gedung D - Lantai 1', isOpen: true, openLabel: 'Buka hingga 14.00', status: UserStatus.non_active, image: '/GerobakHayam/tenant/gerobakHayam.png', qrisImage: '/GerobakHayam/qris/qris_gerobakhayam.png' },
      { name: '2 AR Bunda Rayyan',email: '2arbundarayyan@gmail.com', phone: '081200000015', storeName: 'Kantin Kabel 2 AR Bunda Rayyan', location: 'Gedung B - Lantai 2', isOpen: true, openLabel: 'Tutup sementara',   status: UserStatus.non_active, image: '/kantinKabel2ArBundaRayyan/tenant/2BundaRayan.png', qrisImage: '/kantinKabel2ArBundaRayyan/qris/qris_kantinqarbundarayyan.png' },
      { name: 'Cibay Kabel',      email: 'cibaykabel@gmail.com',     phone: '081200000016', storeName: 'Cibay Kabel',                    location: 'Gedung B - Lantai 2', isOpen: true, openLabel: 'Buka hingga 16.00', status: UserStatus.active,     image: '/cibaykabel/tenant/cibayKabel.png', qrisImage: '/cibaykabel/qris/qris_cibaykabel.png' },
    ].map(seller => ({
      ...seller,
      password: hashedPassword,
      role: Role.seller,
      avatar: null,
    }))

    await prisma.user.createMany({
      data: sellerData,
      skipDuplicates: true,
    })

    console.log(`${sellerData.length} SELLER created`)
    console.log(`Default password: ${plainPassword}`)
  }

  private async hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    })
  }
}
