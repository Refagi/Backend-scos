import { Hono } from 'hono'
import { auth } from '@/middlewares/auth.js'
import { validateMiddlewares } from '@/middlewares/validate.js'
import { ProfileController } from '@/controllers/profile.controller.js'
import { updateProfileSchema, changePasswordSchema } from '@/validations/profile.validation.js'

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
