import type { Context } from 'hono'
import type { Role, NotifType } from '@/generated/prisma/client.js'


export interface SseClient {
  userId: string
  role: Role
  controller: ReadableStreamDefaultController
}

export interface NotifPayload {
  id: string
  userId: string
  role: Role
  title: string
  message: string
  type: NotifType
  isRead: boolean
  pesananId?: string | null
  menuId?: string | null
  createdAt: Date
}

// Menyimpan semua koneksi SSE yang aktif dalam Map<userId, SseClient>

class SseManager {
  private clients = new Map<string, SseClient>()

  addClient(userId: string, role: Role, controller: ReadableStreamDefaultController) {
    this.clients.set(userId, { userId, role, controller })
    console.log(`[SSE] Client connected: ${userId} (${role}) | Total: ${this.clients.size}`)
  }

  removeClient(userId: string) {
    this.clients.delete(userId)
    console.log(`[SSE] Client disconnected: ${userId} | Total: ${this.clients.size}`)
  }

  sendToUser(userId: string, payload: NotifPayload) {
    const client = this.clients.get(userId)
    if (!client) return // user sedang offline — notif sudah tersimpan di DB

    try {
      const data = `data: ${JSON.stringify(payload)}\n\n`
      client.controller.enqueue(new TextEncoder().encode(data))
    } catch {
      this.removeClient(userId)
    }
  }

  // Kirim ke semua user dengan role tertentu (misal: broadcast ke semua seller)
  sendToRole(role: Role, payload: Omit<NotifPayload, 'userId' | 'role'>) {
    this.clients.forEach((client) => {
      if (client.role === role) {
        this.sendToUser(client.userId, { ...payload, userId: client.userId, role })
      }
    })
  }

  // Kirim heartbeat ke semua client (mencegah timeout proxy/nginx)
  sendHeartbeat() {
    this.clients.forEach((client) => {
      try {
        client.controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'))
      } catch {
        this.removeClient(client.userId)
      }
    })
  }

  get size() {
    return this.clients.size
  }
}

export const sseManager = new SseManager()

// Heartbeat setiap 25 detik agar koneksi tidak di-drop proxy/nginx
setInterval(() => sseManager.sendHeartbeat(), 25_000)
