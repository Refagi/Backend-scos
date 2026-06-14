import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { logger } from '@/config/logger';
import { loggerHandler } from '@/config/loggerHandler';
import { config } from '@/config/config';
import { errorHandler } from '@/middlewares/error';
import { authRateLimiter } from '@/middlewares/rateLimiter';
import { xssSanitizeMiddleware } from '@/middlewares/sanitize';
import routes from '@/routes/v1/index.js'

const app = new Hono();

if (config.env !== 'test') {
  app.use(loggerHandler)
}

app.use('*', secureHeaders({
    contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"],
        scriptSrc: ["'self'"],
    },
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
}));

app.use('*', xssSanitizeMiddleware)

app.use(
  '/v1/*',
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/v1/*', compress({encoding: 'gzip'}));

app.route('/v1', routes)

app.get('/v1/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.get('/v1', (c) => {
  logger.info('Root endpoint accessed');
  return c.text('Hello Bun!')
});

if(config.env === 'production') {
  app.use('/v1', authRateLimiter)
}

app.onError(errorHandler);

app.notFound((c) => {
  return c.json({
    code: 404,
    message: 'Route not found'
  }, 404);
});


export default app;
