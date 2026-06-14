import type { Context } from 'hono'
import { catchAsync } from '@/utils/catchAsync.js'
import { ApiError } from '@/utils/ApiError.js'
import httpStatusCode from 'http-status-codes'
import { sseManager } from '@/utils/sseManager'
import { NotifikasiService } from '../services/notifikasi.service'
import type { User } from '@/models/user.model.js'

// ─────────────────────────────────────────────────────────────────────────────
//  SSE Controller
//  Route: GET /notifications/stream
//
//  Browser membuka koneksi ini sekali saat login/halaman dibuka.
//  Koneksi tetap terbuka selama user online.
//  Hono menggunakan Web Streams API (ReadableStream) untuk SSE.
// ─────────────────────────────────────────────────────────────────────────────

export class SseController {

  static stream = catchAsync(async (c: Context) => {
    const user = c.get('user') as User
    if (!user) throw new ApiError(httpStatusCode.UNAUTHORIZED, 'Tidak terautentikasi')

    // Buat ReadableStream — ini yang dikirim sebagai response body
    const stream = new ReadableStream({
      start(controller) {
        sseManager.addClient(user.id, user.role, controller)

        // Kirim event pertama: daftar notifikasi yang belum dibaca
        // Ini menggantikan fetch tambahan di frontend saat pertama connect
        NotifikasiService.getDaftarNotifikasi(user.id).then((notifs) => {
          const payload = `data: ${JSON.stringify({ type: 'INIT', notifikasi: notifs })}\n\n`
          try {
            controller.enqueue(new TextEncoder().encode(payload))
          } catch {}
        })
      },

      cancel() {
        sseManager.removeClient(user.id)
      },
    })


    const response = new Response(stream, {
      headers: {
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection':    'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })

    try {
      const bunServer = (globalThis as any).__BUN_SERVER__;
      if (bunServer?.timeout) {
        bunServer.timeout(c.req.raw, 0);
        console.log(`[SSE] Timeout disabled for user: ${user.id}`);
      }
    } catch (err) {
      console.warn('[SSE] Failed to disable timeout:', err);
    }


    return response
  })
}


export default SseController
