import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Logger } from '@nestjs/common';

const logger = new Logger('RedisService');

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  async get(key: string): Promise<string | null> {
    const result = await this.redisClient.get(key);
    logger.log(`Get key ${key}: ${result}`);
    return result;
  }
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl && ttl > 0) {
      const result = await this.redisClient.set(key, value, 'EX', ttl);
      logger.log(`Set key ${key}: ${result}`);
    } else {
      await this.redisClient.set(key, value);
    }
  }
  async del(key: string): Promise<number> {
    const count = await this.redisClient.del(key);
    logger.log(`Del key ${key}: ${count}`);
    return count;
  }
  async hget(key: string, field: string): Promise<string | null> {
    const result = await this.redisClient.hget(key, field);
    logger.log(`Hget key ${key}: ${result}`);
    return result;
  }
  async hset(key: string, field: string, value: string): Promise<number> {
    const result = await this.redisClient.hset(key, field, value);
    logger.log(`Hset key ${key}: ${result}`);
    return result;
  }
}
