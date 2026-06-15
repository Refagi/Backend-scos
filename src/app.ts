import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { logger } from '@/config/logger.js';
import { loggerHandler } from '@/config/loggerHandler.js';
import { config } from '@/config/config.js';
import { errorHandler } from '@/middlewares/error.js';
import { authRateLimiter } from '@/middlewares/rateLimiter.js';
import { xssSanitizeMiddleware } from '@/middlewares/sanitize.js';
import routes from '@/routes/v1/index.js'

const app = new Hono();

if (config.env !== 'test' && config.env !== 'production') {
  app.use(loggerHandler)
}

app.use('*', secureHeaders({
    contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
    },
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
}));

app.use('*', xssSanitizeMiddleware)

app.use(
  '/v1/*',
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:3000',
      ].filter(Boolean);

      if (origin && origin.includes('vercel.app')) return origin;
      return allowedOrigins.includes(origin) ? origin : 'http://localhost:5173';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/v1/*', compress({encoding: 'gzip'}));

app.route('/v1', routes)

app.get('/v1/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.get('/v1', (c) => {
  return c.json({
    message: 'SCOS API is running',
  });
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
