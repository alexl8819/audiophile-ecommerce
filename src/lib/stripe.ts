import Stripe from 'stripe';

import { secrets } from './secrets';

export const stripeServer = new Stripe(process.env.NODE_ENV === 'production' && Object.keys(secrets).length ? secrets.STRIPE_SECRET_KEY : import.meta.env.STRIPE_SECRET_KEY);

export default { stripeServer };