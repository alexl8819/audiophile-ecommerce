import { createHash, randomUUID } from 'node:crypto';
import ms, { type StringValue } from 'ms';

import { db, eq, Inventory, Products } from 'astro:db';
import { useRedisAdapter, type RedisConfig } from "./adapter/redis";
import { NAMESPACE, type CartItemListing, type CartItemRequest } from "./constants";
import type { Cart } from '../lib/constants';

const DEV = process.env.NODE_ENV !== 'production';

async function useEphemeralCart (redisConfig: RedisConfig, expiration = '6h') {
    const INVENTORY_KEY = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_inventory`;

    const _redis = useRedisAdapter(redisConfig);

    let knownInventory: Cart | null = await _redis.get(INVENTORY_KEY);

    if (!knownInventory) {
        const currentInventory = await db.select({
            slug: Products.slug,
            name: Products.name,
            price: Products.price
        }).from(Inventory).innerJoin(Products, eq(Inventory.product, Products.id));
        const structuredInventory: Cart = {};
        for (const item of currentInventory) {
            structuredInventory[item.slug] = Object.assign({}, structuredInventory[item.slug], {
                name: item.name,
                quantity: structuredInventory[item.slug] ? structuredInventory[item.slug].quantity + 1 : 1,
                price: item.price
            });
        }
        await _redis.set(INVENTORY_KEY, JSON.stringify(structuredInventory));
        knownInventory = structuredInventory;
    }

    const _cart = Object.freeze({
        add: async (key: string | null, item: CartItemRequest) => {
            let cart: Cart | null;
            let uuid: string;

            if (!key) {
                uuid = randomUUID();
                key = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_cart#${createHash('sha256').update(uuid).digest().toString('hex')}`;
                cart = {};
            } else {
                uuid = key;
                cart = await _cart.getAll(key) as Cart;

                if (!cart) { // key expired, start a new cart
                    uuid = randomUUID();
                    cart = {};
                }

                key = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_cart#${createHash('sha256').update(uuid).digest().toString('hex')}`;
            }

            if (cart[item.slug] && ((item.quantity + cart[item.slug].quantity) > knownInventory[item.slug].quantity)) {
                throw new Error('Quantity exceeds inventory availability');
            } else if (item.quantity > knownInventory[item.slug].quantity) {
                item.quantity = 1;
            }

            cart[item.slug] = Object.assign({}, item, {
                name: (knownInventory[item.slug] as CartItemListing).name,
                price: (knownInventory[item.slug] as CartItemListing).price
            });
            
            await _redis.setex(key, ms(expiration as StringValue), JSON.stringify(cart));

            return Object.freeze({ key: uuid });
        },
        update: async (key: string, item: CartItemRequest) => {
            if (!key) {
                throw new Error('Key must be provided');
            }

            let cart: Cart | null = await _cart.getAll(key) as Cart;
            key = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_cart#${createHash('sha256').update(key).digest().toString('hex')}`;

            if (!cart) { // key expired, start a new cart
                throw new Error('Failed to find cart');
            }

            if (!cart[item.slug]) {
                throw new Error('Item does not exist in cart');
            }

            if (cart[item.slug].quantity <= 1 && item.quantity <= -1) {
                const { [item.slug]: _, ...partialObj } = cart;
                cart = partialObj;
            } else {
                if ((cart[item.slug].quantity + item.quantity) > knownInventory[item.slug].quantity) {
                    throw new Error('Quantity exceeds inventory availability');
                }

                cart[item.slug] = Object.assign({}, cart[item.slug], {
                    quantity: cart[item.slug].quantity + item.quantity
                });
            }
            
            await _redis.setex(key, ms(expiration as StringValue), JSON.stringify(cart));
        },
        getAll: async (key: string) => {
            key = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_cart#${createHash('sha256').update(key).digest().toString('hex')}`;
            const existingCart = await _redis.getex(key, {
                ex: ms(expiration as StringValue)
            });
            return existingCart;
        },
        clear: async (key: string) => {
            key = `${NAMESPACE}_${DEV ? 'dev' : 'prod'}_cart#${createHash('sha256').update(key).digest().toString('hex')}`;
            await _redis.setex(key, ms(expiration as StringValue), JSON.stringify({}));
        }
    });
    return _cart;
}

export const cart = await useEphemeralCart({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
});

