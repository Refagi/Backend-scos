import Pusher from 'pusher'
import { config } from '@/config/config.js'

export const pusherServer = new Pusher({
  appId:   process.env.PUSHER_APP_ID! || config.pusher.appId,
  key:     process.env.PUSHER_KEY! || config.pusher.key,
  secret:  process.env.PUSHER_SECRET! || config.pusher.secret,
  cluster: config.pusher.cluster ?? 'ap1',
  useTLS:  true,
})


export async function sendToUser(userId: string, payload: object): Promise<void> {
  try {
    await pusherServer.trigger(`user-${userId}`, 'notifikasi', payload)
  } catch (err) {
    console.error('[Pusher] Gagal kirim ke user:', userId, err)
  }
}
