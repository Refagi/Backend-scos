import prisma from '@/../prisma/client.js'
import { MenuCategory } from '@/generated/prisma/client.js'

const MB = MenuCategory.Makanan_Berat
const CE = MenuCategory.Cemilan
const MI = MenuCategory.Minuman

export class MenuSeedService {
  public async execute(): Promise<void> {
    console.log('Seeding MENU...')

    const sellers = await prisma.user.findMany({
      where: { role: 'seller' },
      select: { id: true, email: true },
    })

  console.log(`Total seller ditemukan: ${sellers.length}`);
  console.log('List email seller:');
  console.log(sellers.map(s => s.email).sort());

    const sid = Object.fromEntries(sellers.map(s => [s.email, s.id]))

    const requiredEmails = [
      'umi@gmail.com', 'nua@gmail.com', 'budi@gmail.com',
      'bundarayyan@gmail.com', 'arfa@gmail.com', 'yum@gmail.com',
      'fajri@gmail.com', 'rohani@gmail.com', 'udin@gmail.com',
      'bunda@gmail.com', 'hayam@gmail.com', '2arbundarayyan@gmail.com',
      'cibaykabel@gmail.com'
    ]

    const missing = requiredEmails.filter(email => !sid[email])
    if (missing.length > 0) {
      throw new Error(`Seller tidak ditemukan: ${missing.join(', ')}. Jalankan SellerSeedService terlebih dahulu.`)
    }

    const menuData = [
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Ayam Geprek',            price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_ayam_geprek.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Chicken Popcorn Crispy', price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_chicken_popcorn_crispy.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Chicken Katsu',          price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_chicken_katsu.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Chicken Teriyaki',       price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_beef_teriyaki.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Ayam Bakar Madu',        price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_ayam_bakar_madu.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Tongseng Ayam',          price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_tongseng_ayam.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Beef Teriyaki',          price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_beef_teriyaki.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Cumi Saus Tiram',        price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_cumi_saus_tiram.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Nasi Goreng Telor',           price: 15000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/nasi_goreng_telur.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Kwetiaw Goreng',              price: 12000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/kwetiau_goreng.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Mie Jebew',                   price: 10000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/mie_jebew.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Seblak Baso Jumbo',           price: 12000, category: MB, isAvailable: true, image: '/kantinDapurUmmi/makanan/seblak_bakso_jumbo.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Hotdog Biasa',                price: 10000, category: CE, isAvailable: true, image: '/kantinDapurUmmi/makanan/hotdog_biasa.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Burger Biasa',                price: 10000, category: CE, isAvailable: true, image: '/kantinDapurUmmi/makanan/burger_biasa.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Jas Jus Dingin',              price: 5000,  category: MI, isAvailable: true, image: '/kantinDapurUmmi/minuman/jasjus_dingin.png' },
      { sellerId: sid['umi@gmail.com'], name: 'Kopi Kapal Api',              price: 5000,  category: MI, isAvailable: true, image: '/kantinDapurUmmi/minuman/kopi_kapal_api.png' },

      { sellerId: sid['nua@gmail.com'], name: 'Sempol Ayam',                 price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Sempol_Ayam.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Sempol Bakar',                price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Sempol_Bakar.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Cirambay',                    price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Cirambay.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Maklor',                      price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Maklor.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Cimin',                       price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Cimin.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Lumpia Telor',                price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Lumpia_Telor.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Cibay',                       price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Cibay.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Cilung Abon',                 price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Cilung.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Mie Sakura',                  price: 5000,  category: CE, isAvailable: true, image: '/kantinTehNua/makanan/Mie_Sakura.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Kopi Panas',                  price: 4000,  category: MI, isAvailable: true, image: '/kantinTehNua/minuman/Kopi Panas.png' },
      { sellerId: sid['nua@gmail.com'], name: 'Kopi Dingin',                 price: 5000,  category: MI, isAvailable: true, image: '/kantinTehNua/minuman/Kopi_Dingin.png' },

      { sellerId: sid['budi@gmail.com'], name: 'Soto Lamongan',              price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/soto_lamongan.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Gado-Gado',                  price: 12000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/gado_gado.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Karedok',                    price: 12000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/karedok.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Mie Jawa',                   price: 12000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/mie_jawa.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Soto Ayam Campur',           price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/soto_ayam_campur.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Soto Ayam Nasi Pisah',       price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/soto_ayam_nasi_pisah.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Soto Ayam Telor Muda',       price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/soto_ayam_telur_muda_uritan.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Ayam Remek Bakar',           price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/ayam_remek_bakar.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Ayam Remek Goreng',          price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/ayam_remek_goreng.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Ayam Remek Sambel Mata',     price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/ayam_remek_sambel_mata.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Ayam Remek Sambel Ijo',      price: 15000, category: MB, isAvailable: true, image: '/kantinKabelLamongan/makanan/ayam_remek_sambel_ijo.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Es Teler',                   price: 10000, category: MI, isAvailable: true, image: '/kantinKabelLamongan/minuman/es_teler.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Teh Manis (Es/Panas)',       price: 3000,  category: MI, isAvailable: true, image: '/kantinKabelLamongan/minuman/teh_manis.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Es Jeruk',                   price: 5000,  category: MI, isAvailable: true, image: '/kantinKabelLamongan/minuman/es_jeruk.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Es Campur',                  price: 10000, category: MI, isAvailable: true, image: '/kantinKabelLamongan/minuman/es_campur_bandung.png' },
      { sellerId: sid['budi@gmail.com'], name: 'Alpukat Kocak',              price: 10000, category: MI, isAvailable: true, image: '/kantinKabelLamongan/minuman/alpukat_kocok.png' },

      { sellerId: sid['bundarayyan@gmail.com'], name: 'Corndog Moza',              price: 8000,  category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Corndog_Mozzarela.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Corndog Sosis',             price: 8000,  category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Corndog_Sosis.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Dimsum Ayam',               price: 5000,  category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Dimsum_Ayam.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Dimsum Chili Oil',          price: 15000, category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Dimsum_Chili_Oil.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Dimsum Mentai',             price: 15000, category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Dimsum_Mentai.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Dimsum Goreng Keju Lumer',  price: 5000,  category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Dimsum_Goreng_Lumer.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Dimsum Saos Mayo',          price: 15000, category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Dimsum_Saus_Mayo.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Papeda',                    price: 3000,  category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Papeda.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Cilung',                    price: 3000,  category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Cilung.png' },
      { sellerId: sid['bundarayyan@gmail.com'], name: 'Tahu Bulat',                price: 5000,  category: CE, isAvailable: true, image: '/cemalcemilkabelbundarayyan/makanan/Tahu_Bulat.png' },

      { sellerId: sid['arfa@gmail.com'], name: 'Pempek Kapal Selam',         price: 19000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Pempek_Kapal_Selam.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Pempek Campur Kecil',        price: 16000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Pempek_Campur_Kecil.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Mie Instan + Telor',         price: 12000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Mie_Instan_Telor.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Pop Mie',                    price: 10000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Pop_Mie.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Mie Tek Tek',                price: 12000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Mie_Tek_Tek.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Nasi Goreng',                price: 12000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Nasi_Goreng.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Nasi Soto Ayam',             price: 15000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Nasi_Soto_Ayam.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Nasi Omlet Mie',             price: 16000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Nasi_Omlet_Mie.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Nasi Ayam Bakar',            price: 13000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Nasi_Ayam_Bakar.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Nasi Ayam Goreng',           price: 13000, category: MB, isAvailable: true, image: '/kantinAlArfa/makanan/Nasi_Ayam_Goreng.png' },
      { sellerId: sid['arfa@gmail.com'], name: 'Teh Manis',                  price: 3000,  category: MI, isAvailable: true, image: '/kantinAlArfa/minuman/Teh_Manis.png' },

      { sellerId: sid['yum@gmail.com'], name: 'Soto Ayam',                   price: 12000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Soto_Ayam.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Nasi Goreng',                 price: 10000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Nasi_Goreng.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Ayam Bakar',                  price: 12000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Ayam_Bakar.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Ayam Goreng',                 price: 12000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Ayam_Goreng.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Ayam Penyet',                 price: 12000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Ayam_Penyet.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Telor Dadar',                 price: 10000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Telor_Dadar.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Telor Balado',                price: 10000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Telor Balado.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Indomie Rebus',               price: 8000,  category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Indomie_Rebus.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Nasi Omlet',                  price: 15000, category: MB, isAvailable: true, image: '/kantinIbuYum/makanan/Nasi_Omlett.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Jasuke',                      price: 5000,  category: CE, isAvailable: true, image: '/kantinIbuYum/makanan/Jasuke.png' },
      { sellerId: sid['yum@gmail.com'], name: 'Es Teh Jumbo',                price: 5000,  category: MI, isAvailable: true, image: '/kantinIbuYum/minuman/Es_Teh_Manis.png' },

      { sellerId: sid['fajri@gmail.com'], name: 'Bakso',                     price: 10000, category: MB, isAvailable: true, image: '/KantinFajri/makanan/Bakso.png' },
      { sellerId: sid['fajri@gmail.com'], name: 'Fanta Susu',                price: 5000,  category: MI, isAvailable: true, image: '/KantinFajri/minuman/Fanta_Susu.png' },
      { sellerId: sid['fajri@gmail.com'], name: 'Sprite Susu',               price: 5000,  category: MI, isAvailable: true, image: '/KantinFajri/minuman/Sprite_Susu.png' },
      { sellerId: sid['fajri@gmail.com'], name: 'Es Teh Jumbo',              price: 4000,  category: MI, isAvailable: true, image: '/KantinFajri/minuman/Es_Teh_Jumbo.png' },
      { sellerId: sid['fajri@gmail.com'], name: 'Thai Tea',                  price: 5000,  category: MI, isAvailable: true, image: '/KantinFajri/minuman/Thai_Tea.png' },
      { sellerId: sid['fajri@gmail.com'], name: 'Green Tea',                 price: 5000,  category: MI, isAvailable: true, image: '/KantinFajri/minuman/Green_Tea.png' },

      { sellerId: sid['rohani@gmail.com'], name: 'Ayam Bakar Madu + Teh Manis', price: 13000, category: MB, isAvailable: true, image: '/ayamBakarBuHjRohani/makanan/Ayam_Bakar_Madu.png' },
      { sellerId: sid['rohani@gmail.com'], name: 'Soto Ayam + Teh Manis',       price: 13000, category: MB, isAvailable: true, image: '/ayamBakarBuHjRohani/makanan/Soto_Ayam.png' },
      { sellerId: sid['rohani@gmail.com'], name: 'Soto Daging',                 price: 13000, category: MB, isAvailable: true, image: '/ayamBakarBuHjRohani/makanan/Soto_Daging.png' },
      { sellerId: sid['rohani@gmail.com'], name: 'Teh Manis',                   price: 2000,  category: MI, isAvailable: true, image: '/ayamBakarBuHjRohani/minuman/Teh_Manis.png' },
      { sellerId: sid['rohani@gmail.com'], name: 'Jus Stroberi',                price: 5000,  category: MI, isAvailable: true, image: '/ayamBakarBuHjRohani/minuman/Jus_Strawberry.png' },

      { sellerId: sid['udin@gmail.com'], name: 'Corndog',                    price: 4000,  category: CE, isAvailable: true, image: '/kantinPakUdin/makanan/Corndog.png' },
      { sellerId: sid['udin@gmail.com'], name: 'Teh Manis',                  price: 3000,  category: MI, isAvailable: true, image: '/kantinPakUdin/minuman/Teh_Manis.png' },
      { sellerId: sid['udin@gmail.com'], name: 'Air Mineral',                price: 5000,  category: MI, isAvailable: true, image: '/kantinPakUdin/minuman/Air_Mineral.png' },
      { sellerId: sid['udin@gmail.com'], name: 'Ayam Celup + Nasi',          price: 15000, category: MB, isAvailable: true, image: '/kantinPakUdin/makanan/Ayam_Celup.png' },
      { sellerId: sid['udin@gmail.com'], name: 'Omelet + Nasi',              price: 18000, category: MB, isAvailable: true, image: '/kantinPakUdin/makanan/Nasi_Omlet.png' },
      { sellerId: sid['udin@gmail.com'], name: 'Kulit + Nasi',               price: 15000, category: MB, isAvailable: true, image: '/kantinPakUdin/makanan/Nasi Kulit.png' },

      { sellerId: sid['bunda@gmail.com'], name: 'Chicken Katsu',             price: 12000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Nasi_Chicken_Katsu.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Nasi Sop Ayam',             price: 13000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Nasi_Sop_Ayam.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Pecel Lele',                price: 15000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Pecel_Lele.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Pecel Ayam',                price: 18000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Pecel_Ayam.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Mie Tek Tek',               price: 12000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Mie_Tek_Tek.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Omlet',                     price: 12000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Omelet.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Nasi Goreng',               price: 12000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Nasi_Goreng.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Nasi Ayam Geprek',          price: 13000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Nasi_Ayam_Geprek.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Nasi Ayam Saos Tiram',      price: 13000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Nasi_Ayam_Saos_Tiram.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Nasi Ayam Bakar',           price: 13000, category: MB, isAvailable: true, image: '/kantinBunda/makanan/Nasi_Ayam_Bakar.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Nasi Telor Barendo',        price: 5000,  category: MB, isAvailable: true, image: '/kantinBunda/makanan/Nasi_Telur_Barendo.png' },
      { sellerId: sid['bunda@gmail.com'], name: 'Teh Manis',                 price: 3000,  category: MI, isAvailable: true, image: '/kantinBunda/minuman/Teh_Manis.png' },

      { sellerId: sid['hayam@gmail.com'], name: 'Paket Ayam Bakar',          price: 18000, category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Ayam_Bakar.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Sate Gajah',                price: 20000, category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Sate_Gajah.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Tahu/Tempe',                price: 3000,  category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Tahu_Tempe.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Telor Ceplok/Dadar',        price: 5000,  category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Telor_Ceplok_Dadar.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Ayam Goreng Rempah',        price: 15000, category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Ayam_Goreng_Rempah.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Kulit Ayam Lada',           price: 10000, category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Kulit_Ayam_Lada.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Kulit Ayam',                price: 8000,  category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Kulit_Ayam.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Tempe Mendoan',             price: 10000, category: CE, isAvailable: true, image: '/GerobakHayam/makanan/Tempe_Mendoan.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Nasi Putih',                price: 5000,  category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Nasi_Putih.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Nasi Daun Jeruk',           price: 5000,  category: MB, isAvailable: true, image: '/GerobakHayam/makanan/Nasi_Daun_Jeruk.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Teh Manis (Es/Hangat)',     price: 5000,  category: MI, isAvailable: true, image: '/GerobakHayam/minuman/Teh_Manis.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Jeruk (Es/Hangat)',         price: 7000,  category: MI, isAvailable: true, image: '/GerobakHayam/minuman/Jeruk.png' },
      { sellerId: sid['hayam@gmail.com'], name: 'Air Mineral',               price: 4000,  category: MI, isAvailable: true, image: '/GerobakHayam/minuman/Air_Mineral.png' },

      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Nasi Paket',       price: 15000, category: MB, isAvailable: true, image: '' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Nasi Katsu',       price: 15000, category: MB, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/makanan/Nasi_Katsu.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Nasi Goreng',      price: 13000, category: MB, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/makanan/Nasi_Goreng.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Nasi Katsu Spicy', price: 15000, category: MB, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/makanan/Nasi_Katsu_Spicy.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Nasi Omlet',       price: 15000, category: MB, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/makanan/Nasi_Omlet.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Kopi Panas',       price: 4000,  category: MI, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/minuman/Kopi_Panas.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Jeruk Panas/Es',   price: 5000,  category: MI, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/minuman/Jeruk_Es_Panas.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Aqua',             price: 4000,  category: MI, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/minuman/Aqua.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Le Mineral',       price: 5000,  category: MI, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/minuman/Le_Minerale.png' },
      { sellerId: sid['2arbundarayyan@gmail.com'], name: 'Teh Pucuk',        price: 5000,  category: MI, isAvailable: true, image: '/kantinKabel2ArBundaRayyan/minuman/Teh_Pucuk.png' },

      { sellerId: sid['cibaykabel@gmail.com'], name: 'Sosis Telor',          price: 5000,  category: CE, isAvailable: true, image: '/cibaykabel/makanan/Sosis_Telor.png' },
      { sellerId: sid['cibaykabel@gmail.com'], name: 'Telur Gulung',         price: 5000,  category: CE, isAvailable: true, image: '/cibaykabel/makanan/Telur_Gulung.png' },
      { sellerId: sid['cibaykabel@gmail.com'], name: 'Baso Goreng',          price: 5000,  category: CE, isAvailable: true, image: '/cibaykabel/makanan/Baso_Goreng.png' },
      { sellerId: sid['cibaykabel@gmail.com'], name: 'Cibay',                price: 5000,  category: CE, isAvailable: true, image: '/cibaykabel/makanan/Cibay.png' },
      { sellerId: sid['cibaykabel@gmail.com'], name: 'Otak-Otak',            price: 5000,  category: CE, isAvailable: true, image: '/cibaykabel/makanan/Otak_Otak.png' },
    ].map((item) => ({
      ...item,
      sellerId: item.sellerId as string,
    }))


    await prisma.menu.createMany({
      data: menuData,
      skipDuplicates: true,
    })

    console.log(`${menuData.length} MENU created`)
  }
}
