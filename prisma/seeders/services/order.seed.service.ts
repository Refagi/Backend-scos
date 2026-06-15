import prisma from '@/../prisma/client.js'
import { OrderStatus } from '@/generated/prisma/client.js'

export class OrderSeedService {
  public async execute(): Promise<void> {
    console.log('Seeding ORDERS...')

    const s = async (email: string): Promise<string> => {
      const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
      if (!user) throw new Error(`Seller tidak ditemukan: ${email}`)
      return user.id
    }

    const c = async (email: string): Promise<string> => {
      const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
      if (!user) throw new Error(`Customer tidak ditemukan: ${email}`)
      return user.id
    }

    const m = async (name: string, sellerEmail: string): Promise<{ id: string; price: number }> => {
      const sellerId = await s(sellerEmail)
      const menu = await prisma.menu.findFirst({
        where: { name, sellerId },
        select: { id: true, price: true },
      })
      if (!menu) throw new Error(`Menu "${name}" dari seller ${sellerEmail} tidak ditemukan`)
      return menu
    }

    const [
      customerA, customerB,
      sellerUmi, sellerNua, sellerBudi, sellerArfa,
      sellerYum, sellerRohani, sellerBunda, sellerHayam,
    ] = await Promise.all([
      c('budi@gmail.com'),
      c('siti@gmail.com'),
      s('umi@gmail.com'),
      s('nua@gmail.com'),
      s('budi@gmail.com'),
      s('arfa@gmail.com'),
      s('yum@gmail.com'),
      s('rohani@gmail.com'),
      s('bunda@gmail.com'),
      s('hayam@gmail.com'),
    ])

    const orders: {
      customerId: string
      sellerId: string
      totalPrice: number
      status: OrderStatus
      slot: string
      notes?: string
      details: {
        menuName: string
        menuPrice: number
        quantity: number
        subtotal: number
        sellerEmail: string
      }[]
    }[] = [
      {
        customerId: customerA, sellerId: sellerUmi,
        totalPrice: 20000, status: OrderStatus.menunggu, slot: '10:00 - 10:30',
        details: [
          { menuName: 'Nasi Ayam Geprek', menuPrice: 15000, quantity: 1, subtotal: 15000, sellerEmail: 'umi@gmail.com' },
          { menuName: 'Jas Jus Dingin',   menuPrice: 5000,  quantity: 1, subtotal: 5000,  sellerEmail: 'umi@gmail.com' },
        ],
      },
      {
        customerId: customerB, sellerId: sellerBudi,
        totalPrice: 25000, status: OrderStatus.dimasak, slot: '11:00 - 11:30',
        details: [
          { menuName: 'Soto Lamongan', menuPrice: 15000, quantity: 1, subtotal: 15000, sellerEmail: 'budi@gmail.com' },
          { menuName: 'Es Teler',      menuPrice: 10000, quantity: 1, subtotal: 10000, sellerEmail: 'budi@gmail.com' },
        ],
      },
      {
        customerId: customerA, sellerId: sellerNua,
        totalPrice: 14000, status: OrderStatus.siap, slot: '10:30 - 11:00',
        details: [
          { menuName: 'Sempol Ayam', menuPrice: 5000, quantity: 2, subtotal: 10000, sellerEmail: 'nua@gmail.com' },
          { menuName: 'Kopi Panas',  menuPrice: 4000, quantity: 1, subtotal: 4000,  sellerEmail: 'nua@gmail.com' },
        ],
      },
      {
        customerId: customerB, sellerId: sellerRohani,
        totalPrice: 13000, status: OrderStatus.selesai, slot: '09:00 - 09:30',
        details: [
          { menuName: 'Ayam Bakar Madu + Teh Manis', menuPrice: 13000, quantity: 1, subtotal: 13000, sellerEmail: 'rohani@gmail.com' },
        ],
      },
      {
        customerId: customerA, sellerId: sellerArfa,
        totalPrice: 22000, status: OrderStatus.ditolak, slot: '12:00 - 12:30',
        details: [
          { menuName: 'Pempek Kapal Selam', menuPrice: 19000, quantity: 1, subtotal: 19000, sellerEmail: 'arfa@gmail.com' },
          { menuName: 'Teh Manis',          menuPrice: 3000,  quantity: 1, subtotal: 3000,  sellerEmail: 'arfa@gmail.com' },
        ],
      },
      {
        customerId: customerB, sellerId: sellerHayam,
        totalPrice: 23000, status: OrderStatus.diterima, slot: '13:00 - 13:30',
        details: [
          { menuName: 'Paket Ayam Bakar',      menuPrice: 18000, quantity: 1, subtotal: 18000, sellerEmail: 'hayam@gmail.com' },
          { menuName: 'Teh Manis (Es/Hangat)', menuPrice: 5000,  quantity: 1, subtotal: 5000,  sellerEmail: 'hayam@gmail.com' },
        ],
      },
      {
        customerId: customerA, sellerId: sellerYum,
        totalPrice: 22000, status: OrderStatus.menunggu, slot: '11:30 - 12:00',
        details: [
          { menuName: 'Soto Ayam',   menuPrice: 12000, quantity: 1, subtotal: 12000, sellerEmail: 'yum@gmail.com' },
          { menuName: 'Nasi Goreng', menuPrice: 10000, quantity: 1, subtotal: 10000, sellerEmail: 'yum@gmail.com' },
        ],
      },
      {
        customerId: customerB, sellerId: sellerBunda,
        totalPrice: 15000, status: OrderStatus.siap, slot: '14:00 - 14:30',
        details: [
          { menuName: 'Chicken Katsu', menuPrice: 12000, quantity: 1, subtotal: 12000, sellerEmail: 'bunda@gmail.com' },
          { menuName: 'Teh Manis',     menuPrice: 3000,  quantity: 1, subtotal: 3000,  sellerEmail: 'bunda@gmail.com' },
        ],
      },
    ]

    let count = 0
    for (const order of orders) {
      const { details, ...orderData } = order

      const resolvedDetails = await Promise.all(
        details.map(async ({ sellerEmail, menuName, menuPrice, quantity, subtotal }) => {
          const menu = await m(menuName, sellerEmail)
          return {
            menuId: menu.id,
            menuName,
            menuPrice,
            quantity,
            subtotal,
          }
        })
      )

      await prisma.pesanan.create({
        data: {
          ...orderData,
          details: {
            createMany: { data: resolvedDetails },
          },
        },
      })

      count++
    }

    console.log(`${count} ORDER created`)
  }
}
