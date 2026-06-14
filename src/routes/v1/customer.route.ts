import { Hono } from 'hono'
import { CustomerController } from '@/controllers/index.js'
import { auth } from '@/middlewares/auth.js'
import { validateMiddlewares } from '@/middlewares/validate.js'
import {
  sellerIdParam,
  pesananIdParam,
  getMenuSellerQuerySchema,
  getRiwayatPesananQuerySchema,
  buatPesananSchema,
} from '@/validations/customer.validation.js'

const customerRoute = new Hono()

customerRoute.get('/sellers', auth(['customer']), CustomerController.getDaftarSeller)

customerRoute.get(
  '/sellers/:sellerId/menu',
  auth(['customer']),
  validateMiddlewares.validateParam(sellerIdParam),
  validateMiddlewares.validateQuery(getMenuSellerQuerySchema),
  CustomerController.getMenuSeller
)

customerRoute.post(
  '/pesanan',
  auth(['customer']),
  validateMiddlewares.validateJson(buatPesananSchema),
  CustomerController.buatPesanan
)

customerRoute.patch(
  '/pesanan/:pesananId/cancel',
  auth(['customer']),
  validateMiddlewares.validateParam(pesananIdParam),
  CustomerController.cancelPesanan
)

customerRoute.patch(
  '/pesanan/:pesananId/konfirmasi-bayar',
  auth(['customer']),
  validateMiddlewares.validateParam(pesananIdParam),
  CustomerController.konfirmasiPembayaran
)

customerRoute.get(
  '/pesanan/riwayat',
  auth(['customer']),
  validateMiddlewares.validateQuery(getRiwayatPesananQuerySchema),
  CustomerController.getRiwayatPesanan
)

customerRoute.get(
  '/pesanan/:pesananId',
  auth(['customer']),
  validateMiddlewares.validateParam(pesananIdParam),
  CustomerController.getDetailPesanan
)

customerRoute.get(
  '/pesanan/:pesananId/ringkasan',
  auth(['customer']),
  validateMiddlewares.validateParam(pesananIdParam),
  CustomerController.getRingkasanPesanan
)

export default customerRoute
