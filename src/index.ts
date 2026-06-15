// import app from '@/app';
// import prisma from '../prisma/client';
// import { logger } from "@/config/logger";
// import { config } from '@/config/config';

// export class Server {
//   private server: any;
//   private port: number;

//   constructor(port: number) {
//     this.port = port;
//   }

//   async start() {
//     try {
//       await prisma.$connect();
//       logger.info("Connected to Database");


//       this.server = Bun.serve({
//         port: this.port,
//         fetch: app.fetch,
//         idleTimeout: 120,
//         error(err: Error) {
//           logger.error(err);
//           return new Response("Internal Server Error", { status: 500 });
//         }
//       });

//       (globalThis as any).__BUN_SERVER__ = this.server;

//       logger.info(`Server running on http://localhost:${this.server.port}/v1`);

//       this.registerProcessHandlers();
//     } catch (error) {
//       logger.error(error as Error);
//       process.exit(1);
//     }
//   }

//   private registerProcessHandlers() {
//     process.on("SIGTERM", () => this.shutdown("SIGTERM"));
//     process.on("SIGINT", () => this.shutdown("SIGINT"));
//   }

//   private async shutdown(signal: string) {
//     logger.warn(`${signal} received. Shutting down...`);

//     try {
//       await prisma.$disconnect();
//       logger.info("Database disconnected");
//     } catch (error) {
//       logger.error(error as Error, {error: "Error during database disconnection"});
//       logger.debug("Error log");
//     }

//     this.server?.stop();
//     process.exit(0);
//   }
// }

// const server = new Server(config.port);
// server.start();




import app from '@/app'

process.on('uncaughtException', (err) => {
  console.error('=== UNCAUGHT EXCEPTION ===')
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('=== UNHANDLED REJECTION ===')
  console.error(reason)
  process.exit(1)
})

async function init() {
  try {
    console.log('=== STARTING SERVER ===')
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)

    const { default: prisma } = await import('../prisma/client')
    console.log('Prisma imported successfully')

    await prisma.$connect()
    console.log('Database connected')

  } catch (err: unknown) {
    console.error('=== INIT ERROR ===')
    console.error(err)
    process.exit(1)
  }
}

void init()

export default app
