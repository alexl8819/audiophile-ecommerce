import { loadStripe } from '@stripe/stripe-js/pure';

export const stripeClient = await loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default stripeClient;