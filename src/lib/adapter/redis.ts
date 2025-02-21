import { Redis } from '@upstash/redis';

export interface RedisConfig {
    url: string,
    token: string
}

export const useRedisAdapter = (redisConfig: RedisConfig) => new Redis(redisConfig);