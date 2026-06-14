import { Hono } from "hono";
import { AuthController } from "@/controllers/index.js";
import { auth } from "@/middlewares/auth";
import { validateMiddlewares } from "@/middlewares/validate.js";
import { login, register, forgotPassord  } from "@/validations/auth.validation";

const authRoute = new Hono();

authRoute.post('/register', validateMiddlewares.validateJson(register), AuthController.register);
authRoute.post('/login', validateMiddlewares.validateJson(login), AuthController.login);
authRoute.post('/logout', AuthController.logout);
authRoute.post('/refresh-token', AuthController.refreshToken);
authRoute.get('/me', auth(), AuthController.getCurrentUser)

export default authRoute;
