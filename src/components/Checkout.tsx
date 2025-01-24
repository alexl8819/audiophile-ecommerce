import { type FC } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { OrderForm } from './forms/OrderForm';
import stripeClient from '../lib/stripe'; 
import { CartSummary } from './Cart';

import { cartItems } from '../stores/cart';
import { useStore } from '@nanostores/react';

interface CheckoutProps {
    amountDue: number
}

export const CheckoutPreview: FC<CheckoutProps> = ({ amountDue }) => {
    const items = useStore(cartItems);

    return (
        <Elements stripe={stripeClient} options={{
            mode: 'payment',
            amount: amountDue,
            currency: 'usd'
        }}>
            <OrderForm>
                <CartSummary items={items} />
            </OrderForm>
        </Elements>
    )
}

export default CheckoutPreview;