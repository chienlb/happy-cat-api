import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { envSchema } from '../env/env.config';
import type { Prisma } from '../../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('Prisma');

  constructor() {
    const env = envSchema.parse(process.env);
    
    // Create PostgreSQL connection pool
    const pool = new Pool({
      connectionString: env.POSTGRESQL_URL,
    });
    
    // Create Prisma adapter
    const adapter = new PrismaPg(pool);
    
    super({
      adapter,
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      errorFormat: 'pretty',
    });

    // Setup event listeners for logging
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Query logging
    this.$on('query' as never, (event: Prisma.QueryEvent) => {
      const env = envSchema.parse(process.env);
      if (env.LOG_LEVEL === 'debug') {
        this.logger.debug(`Query: ${event.query}`);
        this.logger.debug(`Params: ${event.params}`);
        this.logger.debug(`Duration: ${event.duration}ms`);
      }
    });

    // Error logging
    this.$on('error' as never, (event: Prisma.LogEvent) => {
      this.logger.error(`Prisma Error: ${event.message}`);
    });

    // Info logging
    this.$on('info' as never, (event: Prisma.LogEvent) => {
      const env = envSchema.parse(process.env);
      if (['debug', 'info'].includes(env.LOG_LEVEL)) {
        this.logger.log(`Prisma Info: ${event.message}`);
      }
    });

    // Warning logging
    this.$on('warn' as never, (event: Prisma.LogEvent) => {
      const env = envSchema.parse(process.env);
      if (['debug', 'info', 'warn'].includes(env.LOG_LEVEL)) {
        this.logger.warn(`Prisma Warning: ${event.message}`);
      }
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      this.logger.log('Connecting to PostgreSQL...');
      await this.$connect();
      this.logger.log('PostgreSQL connection opened and ready.');
    } catch (error) {
      this.logger.error(`Failed to connect to PostgreSQL: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      this.logger.log('Disconnecting from PostgreSQL...');
      await this.$disconnect();
      this.logger.log('PostgreSQL disconnected successfully.');
    } catch (error) {
      this.logger.error(`Error disconnecting from PostgreSQL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
