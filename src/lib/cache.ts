import { createHash } from 'node:crypto';
import { Redis } from '@upstash/redis';
import ms from 'ms';

import { NAMESPACE } from './constants';

interface RedisConfig {
    url: string,
    token: string
}

function useLRUCache (redisConfig: RedisConfig, expiration = '72h', maxSize = 10000) {
    const _redis = new Redis(redisConfig);

    return Object.freeze({
        hasEntry: async (value: string) => {
            if (!value) {
                throw new Error('Value must be provided');
            }

            value = `${NAMESPACE}_${import.meta.env.DEV ? 'dev' : 'prod'}_${createHash('SHA256').update(value).digest('hex')}`;

            const getValue: string | null | object = await _redis.getex(value, {
                ex: ms(expiration)
            });
            
            return getValue;
        },
        saveEntry: async (key: string, value: string) => {
            if (!key) {
                throw new Error('Key must be provided');
            }

            if (!value) {
                throw new Error('Value must be provided');
            }

            const countKeys = await _redis.keys(`${NAMESPACE}_${import.meta.env.DEV ? 'dev' : 'prod'}_*`);

            if (countKeys.length >= maxSize) {
                throw new Error('Unable to save: exceeds max size');
            }

            key = `${NAMESPACE}_${import.meta.env.DEV ? 'dev' : 'prod'}_${createHash('SHA256').update(key).digest('hex')}`;

            await _redis.setex(key, ms(expiration), value);
        }
    });
}

export const cache = useLRUCache({
    url: import.meta.env.UPSTASH_REDIS_REST_URL,
    token: import.meta.env.UPSTASH_REDIS_REST_TOKEN
});