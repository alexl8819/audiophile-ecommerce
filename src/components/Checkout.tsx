import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import countryVat from 'country-vat';
import { useStore } from '@nanostores/react';
import { loadStripe } from '@stripe/stripe-js/pure';

import { OrderForm } from './forms/OrderForm';
import { type Cart, type CartItemListing, FLAT_SHIPPING_RATE } from '../lib/constants';
import { CartSummary } from './Cart';
import { getCartItems, cartRef } from '../stores/cart';
import { applyVatRate, applyShipping, vatRate } from '../stores/order';
import { toggleCompletion } from '../stores/order';
import { OrderSummary } from './Order';

export const CheckoutPreview = () => {
    const [total, setTotal] = useState<number>(-1);
    const [cartItems, setCartItems] = useState<Cart>({});
    const [shippingCost, setShippingCost] = useState<number>(0);

    const { id } = useStore(cartRef);
    const { mutate } = useStore(getCartItems);
    const appliedVatRate = useStore(vatRate);

    const loadStripeClient = async () => await loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

    const calculateCosts = (items: Cart) => {
        const subtotal = Object.values(items).reduce((acc, val) => acc += (val as CartItemListing).price * val.quantity, 0);
        setShippingCost(subtotal * FLAT_SHIPPING_RATE);

        applyShipping(shippingCost);
        
        setTotal(subtotal + (appliedVatRate > 0 ? (subtotal * appliedVatRate) : 0) + shippingCost);
        console.log(total);
    }

    const handleCountrySet = (countryCode: string) => {
        const rate = countryVat(countryCode);
        
        if (!rate) {
            return;
        }

        applyVatRate(rate);
    };

    const handleOrderComplete = (success: boolean) => toggleCompletion(success);

    const getFinalCart = async () => {
        const res = await mutate({ key: id }) as Response;

        if (!res || !res.ok) {
            window.location.href = '/';
            return;
        }

        const { items } = await res.json();

        if (!Object.keys(items).length) {
            window.location.href = '/';
            return;
        }

        setCartItems(items);
        calculateCosts(items);
    }

    useEffect(() => {
        if (!id) {
            window.location.href = '/';
        } else if (!Object.keys(cartItems).length) {
            getFinalCart();
        } else {
            calculateCosts(cartItems);
        }
    }, [appliedVatRate]);

    if (!id || !Object.keys(cartItems).length || total <= 0) {
        return null;
    }

    return (
        <Elements stripe={loadStripeClient()} options={{ amount: total, mode: 'payment', currency: 'usd' }}>
            <OrderForm onCountrySet={handleCountrySet} onFinish={handleOrderComplete}>
                <CartSummary items={cartItems} shippingFee={shippingCost} vatRate={appliedVatRate} />
            </OrderForm>
            <OrderSummary sampleItem={Object.values(cartItems)[0]} itemsInCart={Object.keys(cartItems).length} total={total} />
        </Elements>
    );
}

export default CheckoutPreview;