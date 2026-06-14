import { Hono } from 'hono'
import { SellerController } from '@/controllers/index.js'
import { auth } from '@/middlewares/auth.js'
import { validateMiddlewares } from '@/middlewares/validate.js'
import {
  menuIdParam,
  pesananIdParam,
  tambahMenuSchema,
  editMenuSchema,
  getMenuQuerySchema,
  getPesananQuerySchema,
  updateStatusPesananSchema,
  getLaporanQuerySchema,
  updateSellerTenantSchema
} from '@/validations/seller.validation.js'

const sellerRoute = new Hono()

sellerRoute.patch(
  '/tenant',
  auth(['seller']),
  validateMiddlewares.validateJson(updateSellerTenantSchema),
  SellerController.updateSellerTenant
)

sellerRoute.get(
  '/menu/:menuId',
  auth(['seller']),
  validateMiddlewares.validateParam(menuIdParam),
  SellerController.getDetailMenu
)

sellerRoute.get(
  '/menu',
  auth(['seller']),
  validateMiddlewares.validateQuery(getMenuQuerySchema),
  SellerController.getSemuaMenu
)

sellerRoute.post(
  '/menu',
  auth(['seller']),
  validateMiddlewares.validateJson(tambahMenuSchema),
  SellerController.tambahMenu
)

sellerRoute.patch(
  '/menu/:menuId',
  auth(['seller']),
  validateMiddlewares.validateParam(menuIdParam),
  validateMiddlewares.validateJson(editMenuSchema),
  SellerController.editMenu
)

sellerRoute.delete(
  '/menu/:menuId',
  auth(['seller']),
  validateMiddlewares.validateParam(menuIdParam),
  SellerController.hapusMenu
)

sellerRoute.get(
  '/pesanan',
  auth(['seller']),
  validateMiddlewares.validateQuery(getPesananQuerySchema),
  SellerController.getPesananMasuk
)

sellerRoute.get(
  '/pesanan/:pesananId',
  auth(['seller']),
  validateMiddlewares.validateParam(pesananIdParam),
  SellerController.getDetailPesanan
)

sellerRoute.patch(
  '/pesanan/:pesananId/status',
  auth(['seller']),
  validateMiddlewares.validateParam(pesananIdParam),
  validateMiddlewares.validateJson(updateStatusPesananSchema),
  SellerController.updateStatusPesanan
)

sellerRoute.get(
  '/laporan',
  auth(['seller']),
  validateMiddlewares.validateQuery(getLaporanQuerySchema),
  SellerController.getLaporanPesanan
)

sellerRoute.get(
  '/dashboard/summary',
  auth(['seller']),
  SellerController.getDashboardSummary
)

sellerRoute.get(
  '/dashboard/grafik-mingguan',
  auth(['seller']),
  SellerController.getGrafikMingguan
)

sellerRoute.get(
  '/dashboard/menu-terlaris',
  auth(['seller']),
  SellerController.getMenuTerlaris
)

export default sellerRoute
