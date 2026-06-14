
import { Hono } from 'hono'
import { AdminController } from '@/controllers/index.js'
import { auth } from '@/middlewares/auth.js'
import { validateMiddlewares } from '@/middlewares/validate.js'
import {
  userIdParam,
  menuIdParam,
  pesananIdParam,
  tambahAkunSchema,
  editAkunSchema,
  getDaftarAkunQuerySchema,
  editMenuSchema,
  getSemuaMenuQuerySchema,
  updateStatusPesananSchema,
  getSemuaPesananQuerySchema,
  laporanBulananQuerySchema,
  limitQuerySchema,
  createMenuSchema
} from '@/validations/admin.validation.js'

const adminRoute = new Hono()


adminRoute.get(
  '/akun',
  auth(['admin']),
  validateMiddlewares.validateQuery(getDaftarAkunQuerySchema),
  AdminController.getDaftarAkun
)

adminRoute.get(
  '/akun/:userId',
  auth(['admin']),
  validateMiddlewares.validateParam(userIdParam),
  AdminController.getDetailAkun
)

adminRoute.post(
  '/akun',
  auth(['admin']),
  validateMiddlewares.validateJson(tambahAkunSchema),
  AdminController.tambahAkun
)

adminRoute.patch(
  '/akun/:userId',
  auth(['admin']),
  validateMiddlewares.validateParam(userIdParam),
  validateMiddlewares.validateJson(editAkunSchema),
  AdminController.editAkun
)

adminRoute.delete(
  '/akun/:userId',
  auth(['admin']),
  validateMiddlewares.validateParam(userIdParam),
  AdminController.hapusAkun
)


adminRoute.post(
  '/menu',
  auth(['admin', 'seller']),
  validateMiddlewares.validateJson(createMenuSchema),
  AdminController.tambahMenu
)

adminRoute.get(
  '/menu',
  auth(['admin']),
  validateMiddlewares.validateQuery(getSemuaMenuQuerySchema),
  AdminController.getSemuaMenu
)

adminRoute.get(
  '/menu/:menuId',
  auth(['admin', 'seller', 'customer']),
  validateMiddlewares.validateParam(menuIdParam),
  AdminController.getDetailMenu
)

adminRoute.patch(
  '/menu/:menuId',
  auth(['admin', 'seller']),
  validateMiddlewares.validateParam(menuIdParam),
  validateMiddlewares.validateJson(editMenuSchema),
  AdminController.editMenu
)

adminRoute.delete(
  '/menu/:menuId',
  auth(['admin']),
  validateMiddlewares.validateParam(menuIdParam),
  AdminController.hapusMenu
)


adminRoute.get(
  '/pesanan',
  auth(['admin']),
  validateMiddlewares.validateQuery(getSemuaPesananQuerySchema),
  AdminController.getSemuaPesanan
)

adminRoute.patch(
  '/pesanan/:pesananId/status',
  auth(['admin']),
  validateMiddlewares.validateParam(pesananIdParam),
  validateMiddlewares.validateJson(updateStatusPesananSchema),
  AdminController.updateStatusPesanan
)

adminRoute.delete(
  '/pesanan/:pesananId',
  auth(['admin']),
  validateMiddlewares.validateParam(pesananIdParam),
  AdminController.hapusPesanan
)


adminRoute.get(
  '/laporan/bulanan',
  auth(['admin']),
  validateMiddlewares.validateQuery(laporanBulananQuerySchema),
  AdminController.getLaporanBulanan
)

adminRoute.get(
  '/laporan/menu-terlaris',
  auth(['admin']),
  validateMiddlewares.validateQuery(limitQuerySchema),
  AdminController.getMenuTerlaris
)

adminRoute.get(
  '/laporan/transaksi-terakhir',
  auth(['admin']),
  validateMiddlewares.validateQuery(limitQuerySchema),
  AdminController.getRiwayatTransaksiTerakhir
)

adminRoute.get(
  '/dashboard/summary',
  auth(['admin']),
  AdminController.getDashboardSummary
)

adminRoute.get(
  '/dashboard/grafik-mingguan',
  auth(['admin']),
  AdminController.getGrafikPesananMingguan
)

export default adminRoute
