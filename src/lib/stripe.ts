import Stripe from 'stripe';

export const stripeServer = new Stripe(process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY : import.meta.env.STRIPE_SECRET_KEY);

export default { stripeServer };