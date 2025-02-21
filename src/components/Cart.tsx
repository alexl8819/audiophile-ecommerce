import { type FC, useState, useEffect, memo } from 'react';
import { Button, Link } from 'react-aria-components';
import { useStore } from '@nanostores/react';
import { type Cart as ShoppingCart, type CartItemListing } from '../lib/constants'; 
import { isOpen, updateCartQuantity, toggleCart, saveCart, emptyCart, cartRef } from '../stores/cart';
import { Xmark, Cart as CartIcon } from './LineIcon';
import ProductShowcase from './Gallery';
import { QuantitySelectionButtonGroup } from './Button';
import { formatCurrency } from '../lib/common';
import { toast } from 'react-toastify';

interface CartItemProps {
    item: CartItemListing
}

const CartItem: FC<CartItemProps> = ({ item }) => {
    const { id, items } = useStore(cartRef);
    const { mutate } = useStore(updateCartQuantity);

    if (!id) {
        return null;
    }
    
    return (
        <div className='flex flex-row justify-start items-center my-4'>
            <div className='w-16'>
                <ProductShowcase name={item.name} path='cart' target={`image-${item.slug}`} responsive={false} />
            </div>
            <div className='flex flex-col w-24 mx-2'>
                <p className='truncate font-bold text-[15px] leading-[25px]'>{ item.name }</p>
                <p className='font-bold text-[15px] leading-[25px] opacity-50'>{ formatCurrency(item.price) } </p>
            </div>
            <div className='w-20'>
                <QuantitySelectionButtonGroup 
                    label='Item Quantity' 
                    value={item.quantity} 
                    increment={async () => {
                        const res = await mutate({ key: id, item: {
                            slug: item.slug,
                            quantity: 1
                        }}) as Response;

                        if (!res.ok) {
                            const { error } = await res.json();
                            toast.error(error);
                            return;
                        }

                        items[item.slug] = Object.assign({}, items[item.slug], {
                            quantity: items[item.slug].quantity + 1
                        });

                        saveCart(id, items);
                    }} 
                    decrement={async () => {
                        const res = await mutate({ key: id, item: {
                            slug: item.slug,
                            quantity: -1
                        }}) as Response;

                        if (!res.ok) {
                            const { error } = await res.json();
                            toast.error(error);
                            return;
                        }

                        items[item.slug] = Object.assign({}, items[item.slug], {
                            quantity: items[item.slug].quantity - 1
                        });

                        saveCart(id, items);
                    }}
                    isDisabled={false} 
                />
            </div>
        </div>
    );
}

interface CartProps {
    items: ShoppingCart
}

export const Cart: FC<CartProps> = ({ items }) => {
    const [subtotal, setSubtotal] = useState<number>(0);

    const opened = useStore(isOpen);
    const { id } = useStore(cartRef);
    const { mutate } = useStore(emptyCart);

    const size = Object.keys(items).length;

    const calculateSubtotal = () => {
        const newSubtotal = Object.values(items).reduce((acc, cur) => acc + (cur.quantity * (cur as CartItemListing).price), 0);
        setSubtotal(newSubtotal);
    }

    const removeCartItems = async () => {
        if (!id) {
            return;
        }

        const res = await mutate({
            key: id
        }) as Response;

        if (!res.ok) {
            toast.error('Failed to empty cart');
        }

        saveCart(id, {});
    }

    useEffect(() => {
        calculateSubtotal();
    }, [items]);

    if (!opened) {
        return null;
    }

    return (
        <div className='fixed inset-0 bg-dark-gray bg-opacity-40 z-50'>
            <div className="flex justify-center md:justify-end items-center md:items-start md:pt-20 md:pr-6 lg:pr-36 min-h-screen mx-4">
                <div className="bg-white border border-gray p-8 rounded-lg shadow-2xl max-w-sm w-full">
                    <div className='flex flex-row justify-end items-center'>
                        <Button type='button' onPress={() => toggleCart()}>
                            <Xmark width={25} height={25} />
                        </Button>
                    </div>
                    <div className='flex flex-row justify-between items-center my-3'>
                        <h3 className='font-bold uppercase'>Cart (<span>{ size }</span>)</h3>
                        {
                            size > 0 ? (
                                <Button type='button' className='underline hover:no-underline hover:text-dim-orange' onPress={() => removeCartItems()}>Remove all</Button>
                            ) : null
                        }
                    </div>
                    {
                        size > 0 ? (
                            <ul className='list-none'>
                            {
                                Object.values(items).map((item, index: number) => (
                                    <CartItem key={index} item={item as CartItemListing} />
                                ))
                            }
                            </ul>
                        ) : (
                            <div className='flex flex-col justify-center items-center'>
                                <CartIcon />
                                <p className='font-bold text-center opacity-50'>Cart is empty...</p>
                            </div>
                        )
                    }
                    <div className='flex flex-row justify-between items-center my-3'>
                        <span className='uppercase'>Subtotal</span>
                        <span className='font-bold'>{ formatCurrency(subtotal)} </span>
                    </div>
                    <div className="flex justify-center items-center text-center">
                        <Link 
                            href='/checkout' 
                            className="px-8 py-3 disabled:bg-dark-gray bg-dim-orange hover:opacity-80 font-bold uppercase text-white text-[13px] tracking-[1px] w-full disabled:cursor-not-allowed"
                            isDisabled={size === 0}
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface CartSummaryItemProps {
    item: CartItemListing
}

export const CartSummaryItem: FC<CartSummaryItemProps> = ({ item }) => (
    <div className='flex flex-row justify-between items-center my-4'>
        <div className='flex flex-row justify-evenly md:justify-between items-center w-full md:w-auto'>
            <div className='w-16'>
                <ProductShowcase name={item.name} path='cart' target={`image-${item.slug}`} responsive={false} />
            </div>
            <div className='flex flex-col w-36 md:w-auto ml-5 md:ml-4'>
                <p className='truncate uppercase font-bold text-[15px] leading-[25px]'>{ item.name }</p>
                <p className='font-bold text-[14px] leading-[25px] opacity-50'>{ formatCurrency(item.price) }</p>
            </div>
        </div>
        <div className='w-auto'>
            <span className='font-bold text-[15px] leading-[25px] opacity-50'>x{ item.quantity }</span>
        </div>
    </div>
)

interface CartSummaryProps {
    items: ShoppingCart
    shippingFee: number
    vatRate: number
}

export const CartSummary: FC<CartSummaryProps> = memo(({ items, shippingFee, vatRate }) => {
    const [subtotal, setSubtotal] = useState<number>(0);
    const [vatCost, setVatCost] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    const calculateAll = () => {
        const newSubtotal = Object.values(items).reduce((acc, item) => acc += (item.quantity * (item as CartItemListing).price), 0);
        setSubtotal(newSubtotal);
        const newVatCost = vatRate > 0 ? newSubtotal * vatRate : 0;
        setVatCost(newVatCost);
        const newGrandtotal = (newSubtotal + shippingFee);
        setGrandTotal(newGrandtotal);
    }

    useEffect(() => {
        calculateAll();
    }, [vatRate]);

    return (
        <div className='flex flex-col py-4'>
            <h2 className='uppercase text-left font-bold text-[18px] tracking-[1.29px]'>Summary</h2>
            <ul className='list-none'>
                {
                    Object.values(items).map((item, index: number) => (
                        <li key={index}>
                            <CartSummaryItem item={item as CartItemListing} />
                        </li>
                    ))
                }
            </ul>
            <div className='flex flex-row justify-between items-center'>
                <span className='uppercase font-medium leading-[25px] opacity-50'>Subtotal</span>
                <span className='font-bold text-[18px]'>{ formatCurrency(subtotal) }</span>
            </div>
            <div className='flex flex-row justify-between items-center'>
                <span className='uppercase font-medium leading-[25px] opacity-50'>Shipping</span>
                <span className='font-bold text-[18px]'>{ formatCurrency(shippingFee) }</span>
            </div>
            {
                vatRate > 0 ? (
                    <div className='flex flex-row justify-between items-center'>
                        <span className='uppercase font-medium leading-[25px] opacity-50'>VAT (included @ { vatRate }%)</span>
                        <span className='font-bold text-[18px]'>{ formatCurrency(vatCost) }</span>
                    </div>
                ) : null
            }
            <div className='flex flex-row justify-between items-center mt-8'>
                <span className='uppercase font-medium leading-[25px] opacity-50'>Total</span>
                <span className='font-bold text-[18px] text-dim-orange'>{ formatCurrency(grandTotal) }</span>
            </div>
        </div>
    );
});