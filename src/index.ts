import app from '@/app'
import prisma from '../prisma/client'
import { logger } from '@/config/logger'

prisma.$connect()
  .then(() => logger.info('Connected to Database'))
  .catch((err) => logger.error(err))

export default app
