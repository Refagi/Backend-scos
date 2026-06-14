import { Hono } from 'hono'
import { auth } from '@/middlewares/auth'
import { validateMiddlewares } from '@/middlewares/validate'
import { ProfileController } from '@/controllers/profile.controller'
import { updateProfileSchema, changePasswordSchema } from '@/validations/profile.validation'

const profileRoute = new Hono()

profileRoute.get(
  '/',
  auth(['admin', 'seller', 'customer']),
  ProfileController.getProfile
)

profileRoute.patch(
  '/',
  auth(['admin', 'seller', 'customer']),
  validateMiddlewares.validateJson(updateProfileSchema),
  ProfileController.updateProfile
)

profileRoute.patch(
  '/change-password',
  auth(['admin', 'seller', 'customer']),
  validateMiddlewares.validateJson(changePasswordSchema),
  ProfileController.changePassword
)

export default profileRoute
