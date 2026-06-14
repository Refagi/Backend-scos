import { Hono } from 'hono'
import { SseController, NotifikasiController } from '@/controllers/index.js'
import { auth } from '@/middlewares/auth.js'

const notifikasiRouter = new Hono()

// Semua route di sini butuh autentikasi
notifikasiRouter.use('*', auth(['customer', 'seller', 'admin']))

// ── SSE Stream ────────────────────────────────────────────────────────────────
// Browser membuka koneksi ini sekali dan mempertahankannya
// GET /notifications/stream
notifikasiRouter.get('/stream', SseController.stream)

// ── REST endpoints ────────────────────────────────────────────────────────────
// GET  /notifications                  → daftar semua notifikasi user
// GET  /notifications/unread-count     → jumlah badge
// PATCH /notifications/read-all        → tandai semua dibaca
// PATCH /notifications/:notifId/read   → tandai satu dibaca
// DELETE /notifications                → hapus semua

notifikasiRouter.get('/',              NotifikasiController.getDaftar)
notifikasiRouter.get('/unread-count',  NotifikasiController.getJumlahBelumDibaca)
notifikasiRouter.patch('/read-all',    NotifikasiController.tandaiSemuaDibaca)
notifikasiRouter.patch('/:notifId/read', NotifikasiController.tandaiDibaca)
notifikasiRouter.delete('/',           NotifikasiController.hapusSemua)

export default notifikasiRouter
