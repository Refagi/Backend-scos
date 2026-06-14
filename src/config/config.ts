import { z } from 'zod';
import type{ TokenTypeConfig } from '@/models/token.model';

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().trim().min(1, { message: 'DATABASE_URL is required' }),
  DATABASE_URL_TESTING: z.string().trim().optional(),
  JWT_SECRET: z.string().trim().min(1, { message: 'JWT_SECRET is required' }),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(60),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce.number().default(5),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce.number().default(5),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  FRONTEND_URL: z.string(),
});

class AppConfig {
  private typeEnv: z.infer<typeof envSchema>;
  private databaseUrl: string | null = null;

  constructor() {
    const parsedEnv = envSchema.safeParse(Bun.env);

    if (!parsedEnv.success) {
      console.error("Environment variables validation failed: ", z.treeifyError(parsedEnv.error));
      throw new Error("Invalid environment configuration");
    }

    this.typeEnv= parsedEnv.data;
    this.getDatabaseUrl();
 }

  private getDatabaseUrl(): void {
    if (this.typeEnv.NODE_ENV === "test") {
      if (!this.typeEnv.DATABASE_URL_TESTING) {
        throw new Error("DATABASE_URL_TESTING is required for testing");
      }
      const testUrl = this.typeEnv.DATABASE_URL_TESTING.replace(
        /\/postgres(\?|$)/, "/testingDb$1"
      );

      console.log("Using test database:", testUrl);
      this.databaseUrl = testUrl;
    }
    console.log(`Using ${this.typeEnv.NODE_ENV} database`);
    this.databaseUrl = this.typeEnv.DATABASE_URL;
  }

  get env(): string {
    return this.typeEnv.NODE_ENV;
  }

  get port(): number {
    return this.typeEnv.PORT;
  }

  get database(): string {
    if(!this.databaseUrl) {
      throw new Error("Database URL is not initilized");
    }
    return this.databaseUrl!;
  }

  get jwt(): TokenTypeConfig{
    return {
      secret: this.typeEnv.JWT_SECRET,
      accessExpirationMinutes: this.typeEnv.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: this.typeEnv.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes: this.typeEnv.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes: this.typeEnv.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    }
  }

  get email() {
    return {
      smtp: {
        host: this.typeEnv.SMTP_HOST,
        port: this.typeEnv.SMTP_PORT,
        auth: {
          user: this.typeEnv.SMTP_USERNAME,
          pass: this.typeEnv.SMTP_PASSWORD
        },
      },
      from: this.typeEnv.EMAIL_FROM
    }
  }
  get fe(): string {
    return this.typeEnv.FRONTEND_URL;
  }
}

export const config = new AppConfig();
