import { type FC, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import countryVat from 'country-vat';

import { OrderForm } from './forms/OrderForm';
import stripeClient from '../lib/stripe'; 
import { CartSummary } from './Cart';
import { cartItems } from '../stores/cart';
import { useStore } from '@nanostores/react';

interface CheckoutProps {
    amountDue: number
    shippingCost: number
}

export const CheckoutPreview: FC<CheckoutProps> = ({ amountDue, shippingCost }) => {
    const [total, setTotal] = useState<number>(-1);
    const [vatRate, setVatRate] = useState<number>(0);
    
    const items = useStore(cartItems);

    const handleCountrySet = (countryCode: string) => {
        const rate = countryVat(countryCode);
        
        if (!rate) {
            return;
        }

        setVatRate(rate);
    };

    useEffect(() => {
        setTotal(amountDue + (vatRate > 0 ? (amountDue * vatRate) : 0) + shippingCost);
    }, [vatRate]);

    if (total < 0) {
        return null;
    }

    return (
        <Elements stripe={stripeClient} options={{
            mode: 'payment',
            amount: total,
            currency: 'usd'
        }}>
            <OrderForm onCountrySet={handleCountrySet}>
                <CartSummary items={items} shippingFee={shippingCost} vatRate={vatRate} />
            </OrderForm>
        </Elements>
    )
}

export default CheckoutPreview;