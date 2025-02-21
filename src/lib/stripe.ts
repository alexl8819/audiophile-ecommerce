import Stripe from 'stripe';

export const stripeServer = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export default { stripeServer };