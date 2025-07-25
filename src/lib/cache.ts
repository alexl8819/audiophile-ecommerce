import { createHash } from 'node:crypto';
import { type RedisConfig, useRedisAdapter } from './adapter/redis';
import ms, { type StringValue } from 'ms';

import { NAMESPACE } from './constants';

const DEV = process.env.NODE_ENV !== 'production';

function useLRUCache (redisConfig: RedisConfig, expiration = '72h', maxSize = 10000) {
    const _redis = useRedisAdapter(redisConfig);

    return Object.freeze({
        hasEntry: async (value: string) => {
            if (!value) {
                throw new Error('Value must be provided');
            }

            value = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_${createHash('SHA256').update(value).digest('hex')}`;

            const getValue: string | null | object = await _redis.getex(value, {
                ex: ms(expiration as StringValue)
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

            const countKeys = await _redis.keys(`${NAMESPACE}_${DEV ? 'dev' : 'prod'}_*`);

            if (countKeys.length >= maxSize) {
                throw new Error('Unable to save: exceeds max size');
            }

            key = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_${createHash('SHA256').update(key).digest('hex')}`;

            await _redis.setex(key, ms(expiration as StringValue), value);
        }
    });
}

export const cache = useLRUCache({
    url: !DEV ? process.env.UPSTASH_REDIS_REST_URL : import.meta.env.UPSTASH_REDIS_REST_URL,
    token: !DEV ? process.env.UPSTASH_REDIS_REST_TOKEN : import.meta.env.UPSTASH_REDIS_REST_TOKEN
});