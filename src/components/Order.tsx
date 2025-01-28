import { useState, useEffect, type FC } from 'react';
import { Button } from 'react-aria-components';
import { useStore } from '@nanostores/react';

import { formatCurrency } from '../lib/common';
import type { CartItem } from '../lib/constants';
import { CartSummaryItem } from './Cart';
import { isComplete, toggleCompletion } from '../stores/order';

interface OrderSummaryProps {
    sampleItem: CartItem
    itemsInCart: number
    total: number
}

export const OrderSummary: FC<OrderSummaryProps> = ({ sampleItem, itemsInCart, total }) => {
    const [_window, setWindow] = useState<Window | null>(null);
    const [icon, setIcon] = useState<string | null>(null);
    const shouldOpen = useStore(isComplete);

    const loadIcon = async () => {
        let loadedIcon;

        try {
            loadedIcon = await import('../assets/checkout/icon-order-confirmation.svg');
        } catch (err) {
            console.error(err);
            return;
        }

        setIcon(loadedIcon.default.src);
    }

    const handleClose = () => {
        toggleCompletion(false);

        if (_window) {
            _window.location.href = '/';
        }
    }

    useEffect(() => {
        if (typeof window !== undefined) {
            setWindow(window);
        }

        loadIcon();
    }, []);

    if (!shouldOpen) {
        return null;
    }

    return (
        <div className='fixed inset-0 bg-dark-gray bg-opacity-40 z-50'>
            <div className="flex justify-center items-center min-h-screen mx-6">
                <div className="bg-white border border-gray p-8 rounded-lg shadow-2xl max-w-sm w-full">
                    <div className='mb-6'>
                        {
                            icon ? <img src={icon} alt='checkout checkmark icon' loading='eager' /> : null
                        }
                    </div>
                    <div className='flex flex-col'>
                        <h2 className='font-bold uppercase text-[24px] leading-[28px] tracking-[0.86px] mb-4'>Thank you for your order</h2>
                        <p className='font-medium text-[15px] leading-[25px] opacity-50 mb-2'>You will receive an email confirmation shortly.</p>
                    </div>
                    <div className='bg-light-gray rounded-lg py-2 mt-4'>
                        <CartSummaryItem item={sampleItem} />
                        <div className='border-b border-dark-gray opacity-20 mx-6 my-2'></div>
                        {
                            itemsInCart > 1 ? (
                                <p className='text-center font-bold text-[12px] tracking-[-0.21px] opacity-50 pb-6'>and { itemsInCart } other item(s)</p>
                            ) : null
                        }
                    </div>
                    <div className='flex flex-col items-start bg-black text-white rounded-b-lg mt-1 mb-3 p-4'>
                        <p className='uppercase font-medium text-[15px] leading-[25px] opacity-50'>Grand Total</p>
                        <p className='font-bold text-[18px]'>{ formatCurrency(total)}</p>
                    </div>
                    <div className="flex justify-center items-center text-center">
                        <Button 
                            onPress={handleClose} 
                            className="px-8 py-3 bg-dim-orange font-bold uppercase text-white text-[13px] tracking-[1px] w-full"
                        >
                            Back to home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}