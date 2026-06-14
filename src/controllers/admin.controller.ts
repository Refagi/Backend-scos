import httpStatusCode from 'http-status-codes';
import { ApiError } from '@/utils/ApiError.js';
import { catchAsync } from '@/utils/catchAsync.js';
import { AdminService } from '@/services/index.js';
import { type Context } from 'hono';
import type {
  UserIdParam,
  MenuIdParam,
  PesananIdParam,
  GetDaftarAkunQuery,
  TambahAkunBody,
  EditAkunBody,
  GetSemuaMenuQuery,
  EditMenuBody,
  GetSemuaPesananQuery,
  UpdateStatusPesananBody,
  LaporanBulananQuery,
  LimitQuery,
  CreateMenuInput
} from '@/validations/admin.validation';

class AdminController {
  static getDaftarAkun = catchAsync(async (c: Context) => {
    const query = c.get('parsedQuery') as GetDaftarAkunQuery;

    const result = await AdminService.getDaftarAkun(query);
    return c.json({
      status: httpStatusCode.OK,
      data: result.data,
      pagination: result.pagination,
    });
  });

  static getDetailAkun = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as UserIdParam;
    const akun = await AdminService.getDetailAkun(param.userId);

    return c.json({ status: httpStatusCode.OK, data: akun });
  });

  static tambahAkun = catchAsync(async (c: Context) => {
    const body = c.get('parsedJson') as TambahAkunBody;
    const akun = await AdminService.tambahAkun(body);

    return c.json({
      status: httpStatusCode.CREATED,
      message: 'Akun berhasil dibuat',
      data: akun,
    });
  });

  static editAkun = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as UserIdParam;
    const body = c.get('parsedJson') as EditAkunBody;

    const akun = await AdminService.editAkun(param.userId, body);

    return c.json({
      status: httpStatusCode.OK,
      message: 'Akun berhasil diperbarui',
      data: akun,
    });
  });

  static hapusAkun = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as UserIdParam;
    const currentAdmin = c.get('user') as { id: string };
    await AdminService.hapusAkun(param.userId, currentAdmin.id);

    return c.json({
      status: httpStatusCode.OK,
      message: 'Akun berhasil dihapus',
    });
  });

  static tambahMenu = catchAsync(async (c: Context) => {
    const body = c.get('parsedJson') as CreateMenuInput;
    const menu = await AdminService.tambahMenu(body);

    return c.json({
      status: httpStatusCode.CREATED,
      message: 'Menu berhasil ditambahkan',
      data: menu,
    });
  });

  static getSemuaMenu = catchAsync(async (c: Context) => {
    const query = c.get('parsedQuery') as GetSemuaMenuQuery;
    const menus = await AdminService.getSemuaMenu(query);

    return c.json({ status: httpStatusCode.OK, data: menus });
  });

  static getDetailMenu = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as MenuIdParam;
    const menu = await AdminService.getDetailMenu(param.menuId);
    return c.json({
      status: httpStatusCode.OK,
      data: menu,
    });
  });

  static editMenu = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as MenuIdParam;
    const body = c.get('parsedJson') as EditMenuBody;

    const menu = await AdminService.editMenu(param.menuId, body);

    return c.json({
      status: httpStatusCode.OK,
      message: 'Menu berhasil diperbarui',
      data: menu,
    });
  });

  static hapusMenu = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as MenuIdParam;
    await AdminService.hapusMenu(param.menuId);

    return c.json({
      status: httpStatusCode.OK,
      message: 'Menu berhasil dihapus',
    });
  });

  static getSemuaPesanan = catchAsync(async (c: Context) => {
    const query = c.get('parsedQuery') as GetSemuaPesananQuery;
    const result = await AdminService.getSemuaPesanan(query);

    return c.json({ status: httpStatusCode.OK, data: result.data, pagination: result.pagination });
  });

  static updateStatusPesanan = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as PesananIdParam;
    const body = c.get('parsedJson') as UpdateStatusPesananBody;

    const pesanan = await AdminService.updateStatusPesanan(
      param.pesananId,
      body
    );

    return c.json({
      status: httpStatusCode.OK,
      message: 'Status pesanan berhasil diperbarui',
      data: pesanan,
    });
  });

  static hapusPesanan = catchAsync(async (c: Context) => {
    const param = c.get('parsedParam') as PesananIdParam;
    await AdminService.hapusPesanan(param.pesananId);

    return c.json({
      status: httpStatusCode.OK,
      message: 'Pesanan berhasil dihapus',
    });
  });

  static getLaporanBulanan = catchAsync(async (c: Context) => {
    const query = c.get('parsedQuery') as LaporanBulananQuery;
    const { year, month } = query;

    const laporan = await AdminService.getLaporanBulanan(year, month);
    return c.json({ status: httpStatusCode.OK, data: laporan });
  });

  static getMenuTerlaris = catchAsync(async (c: Context) => {
    const query = c.get('parsedQuery') as LimitQuery;
    const limit = query.limit ?? 10;

    const result = await AdminService.getMenuTerlaris(limit);
    return c.json({ status: httpStatusCode.OK, data: result });
  });

  static getRiwayatTransaksiTerakhir = catchAsync(async (c: Context) => {
    const query = c.get('parsedQuery') as LimitQuery;
    const limit = query.limit ?? 20;

    const result = await AdminService.getRiwayatTransaksiTerakhir(limit);
    return c.json({ status: httpStatusCode.OK, data: result });
  });

  static getDashboardSummary = catchAsync(async (c: Context) => {
    const data = await AdminService.getDashboardSummary();
    return c.json({ status: httpStatusCode.OK, data });
  });

  static getGrafikPesananMingguan = catchAsync(async (c: Context) => {
    const data = await AdminService.getGrafikPesananMingguan();
    return c.json({ status: httpStatusCode.OK, data });
  });
}

export default AdminController;
