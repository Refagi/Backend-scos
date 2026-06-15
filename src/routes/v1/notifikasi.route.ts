import { Hono } from 'hono'
import {  NotifikasiController } from '@/controllers/index.js'
import { auth } from '@/middlewares/auth.js'

const notifikasiRouter = new Hono()

notifikasiRouter.use('*', auth(['customer', 'seller', 'admin']))

notifikasiRouter.get('/',              NotifikasiController.getDaftar)
notifikasiRouter.get('/unread-count',  NotifikasiController.getJumlahBelumDibaca)
notifikasiRouter.patch('/read-all',    NotifikasiController.tandaiSemuaDibaca)
notifikasiRouter.patch('/:notifId/read', NotifikasiController.tandaiDibaca)
notifikasiRouter.delete('/',           NotifikasiController.hapusSemua)

export default notifikasiRouter
