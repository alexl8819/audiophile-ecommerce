import { type FC } from 'react';
import { Button, Link } from 'react-aria-components';
import { useStore } from '@nanostores/react';
import type { CartItem } from '../lib/constants';
import { isOpen, toggleCart, empty, type Cart as ShoppingCart } from '../stores/cart';
import { Xmark } from './LineIcon';
import ProductShowcase from './Gallery';
import { QuantitySelectionButtonGroup } from './Button';
import { formatCurrency } from '../lib/common';

interface CartItemProps {
    item: CartItem
}

const CartItem: FC<CartItemProps> = ({ item }) => {
    return (
        <div className='flex flex-row justify-evenly items-center'>
            <div className='w-16'>
                <ProductShowcase name={item.name} path='cart' target={`image-${item.slug}`} responsive={false} />
            </div>
            <div className='flex flex-col w-auto'>
                <p>{ item.name }</p>
                <p>{ formatCurrency(item.price) } </p>
            </div>
            <div className='w-20'>
                <QuantitySelectionButtonGroup label='Item Quantity' value={item.quantity} increment={() => {}} decrement={() => {}} isDisabled={false} />
            </div>
        </div>
    );
}

interface CartProps {
    items: ShoppingCart
}

export const Cart: FC<CartProps> = ({ items }) => {
    const opened = useStore(isOpen);

    if (!opened) {
        return null;
    }

    const size = Object.keys(items).length;

    return (
        <div className='fixed inset-0 bg-dark-gray bg-opacity-40 z-50'>
            <div className="flex justify-center items-center min-h-screen mx-6">
                <div className="bg-white border border-gray p-8 rounded-lg shadow-2xl max-w-sm w-full">
                    <div className='flex flex-row justify-end items-center'>
                        <Button type='button' onPress={() => toggleCart()}>
                            <Xmark width={25} height={25} />
                        </Button>
                    </div>
                    <div className='flex flex-row justify-between items-center my-3'>
                        <h3 className='font-bold uppercase'>Cart (<span>{ size }</span>)</h3>
                        <Button type='button' className='underline' onPress={() => empty()}>Remove all</Button>
                    </div>
                    <ul className='list-none'>
                        {
                            Object.values(items).map((item: CartItem, index: number) => (
                                <CartItem key={index} item={item} />
                            ))
                        }
                    </ul>
                    <div className='flex flex-row justify-between items-center my-3'>
                        <span className='uppercase'>Subtotal</span>
                        <span className='font-bold'>$0</span>
                    </div>
                    <div className="flex justify-center items-center text-center">
                        <Link href='/checkout' className="px-8 py-3 uppercase bg-dim-orange text-white w-full">Checkout</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}