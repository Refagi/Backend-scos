import app from '@/app';
import prisma from '../prisma/client';
import { logger } from "@/config/logger";
import { config } from '@/config/config';
import { serve } from '@hono/node-server';

export class Server {
  private server: any;
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  async start() {
    try {
      await prisma.$connect();
      logger.info("Connected to Database");


      this.server = serve({
        port: this.port,
        fetch: app.fetch,
      });

      logger.info(`Server running on http://localhost:${this.port}/v1`);

      this.registerProcessHandlers();
    } catch (error) {
      logger.error(error as Error);
      process.exit(1);
    }
  }

  private registerProcessHandlers() {
    process.on("SIGTERM", () => this.shutdown("SIGTERM"));
    process.on("SIGINT", () => this.shutdown("SIGINT"));
  }

  private async shutdown(signal: string) {
    logger.warn(`${signal} received. Shutting down...`);

    try {
      await prisma.$disconnect();
      logger.info("Database disconnected");
    } catch (error) {
      logger.error(error as Error, {error: "Error during database disconnection"});
      logger.debug("Error log");
    }

    process.exit(0);
  }
}

const server = new Server(config.port);
server.start();
