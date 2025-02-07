import { type FC, useState, useEffect } from 'react';
import { Button, Link } from 'react-aria-components';
import { ToastContainer, toast } from 'react-toastify';
import iconArrowRight from '../assets/shared/desktop/icon-arrow-right.svg';
import { type Item, type RecommendedProduct } from '../lib/constants';
import { formatCurrency } from '../lib/common';
import { type ShowcaseStyling, ProductShowcase } from './Gallery';
import { QuantitySelectionButtonGroup } from './Button';

import { addCartItem } from '../stores/cart';
import { addProductToInventory } from '../stores/inventory';
import { CategoryDisplaySkeleton } from './Skeleton';

import 'react-toastify/ReactToastify.css';

interface CategoryProductCardProps {
    category: string
    url: string
}

export const CategoryProductCard: FC<CategoryProductCardProps> = ({ category, url }) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    const loadThumbnail = async () => {
        let loadedThumbnail;

        try {
            loadedThumbnail = await import(`../assets/shared/desktop/image-category-thumbnail-${category}.png`);
        } catch (err) {
            console.error(err);
        }

        setThumbnail(loadedThumbnail.default.src);
    }

    useEffect(() => {
        loadThumbnail();
    }, []);

    return (
        <div className='flex flex-col justify-center items-center bg-light-gray py-6 w-full'>
            {
                thumbnail ? (
                    <figure className='flex flex-col justify-center items-center'>
                        <img src={thumbnail} className='-mt-16 w-auto h-[104px]' alt={`${category} thumbnail`} loading='lazy' />
                        <figcaption className='uppercase font-bold text-[15px] leading-normal tracking-[1.07px]'>{ category }</figcaption>
                    </figure>
                ) : <CategoryDisplaySkeleton />
            }
            <Link href={url} className='uppercase flex flex-row items-center space-x-3 mt-[17px]'>
                <span className='font-bold text-[13px] opacity-50'>Shop</span> 
                <img src={iconArrowRight.src} alt={`link to ${category}`} />
            </Link>
        </div>
    );
}

interface ProductCardProps {
    name: string
    description: string
    category: string
    isPreview: boolean
    productId: string
    features?: string
    isNew?: boolean
    price?: number
    galleryImages?: number
    availableQuantity?: number
    includes?: Array<Item>
    flipRow?: boolean
}

export const ProductCard: FC<ProductCardProps> = ({ 
    name, description, category, isPreview, features, productId, 
    isNew, price, galleryImages, availableQuantity, includes, flipRow = false
}) => {
    const [quantitySelected, setQuantitySelected] = useState<number>(1);

    const changeQuantity = (quantity: number) => {
        const available = availableQuantity || 1;

        if (quantity < 1 || quantity > available) {
            return;
        }
        
        setQuantitySelected(quantity);
    };

    useEffect(() => {
        // Add product to local inventory
        if (!isPreview && availableQuantity) {
            addProductToInventory(productId, availableQuantity);
        }
    }, []);

    return (
        <div className={!isPreview ? 'text-left' : 'text-center lg:text-left'}>
            <section className={!isPreview ? `flex flex-col md:flex-row mb-11` : `flex flex-col ${flipRow ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:items-center mb-11`}>
                <div className='md:w-full lg:w-1/2 md:h-full'>
                    <ProductShowcase name={name} path={`product-${productId}`} target={`image-${isPreview ? 'category-page-preview' : 'product'}`} />
                </div>
                <div className='md:ml-2 flex flex-col md:px-16 lg:w-1/2'>
                    {
                        isNew || isPreview ? (
                            <p className='uppercase text-dim-orange text-[14px] tracking-[10px] my-3'>New product</p>
                        ) : null
                    }
			        <h2 className='font-bold uppercase text-[28px] lg:text-[40px] lg:leading-[44px] tracking-[1px] lg:tracking-[1.43px] my-3'>{ name }</h2>
                    <p className='font-medium text-[15px] leading-[25px] opacity-50 mt-3 mb-8'>{ description }</p>
                    {
                        !isPreview && price ? (
                            <>
                                <p className='font-bold text-[18px] tracking-[1.29px]'>{ formatCurrency(price) }</p>
                                <div className='flex flex-row justify-start items-center my-6'>
                                    <QuantitySelectionButtonGroup 
                                        label='Quantity'
                                        value={quantitySelected}
                                        decrement={() => changeQuantity(quantitySelected - 1)}
                                        increment={() => changeQuantity(quantitySelected + 1)}
                                        isDisabled={availableQuantity === 0} 
                                    />
                                    <Button 
                                        type='button' 
                                        className='bg-dim-orange hover:opacity-80 text-white py-3 px-8 font-bold uppercase text-[13px] tracking-[1px] ml-6 md:ml-8'
                                        isDisabled={availableQuantity === 0}
                                        onPress={() => {
                                            const success = addCartItem({
                                                name,
                                                price,
                                                slug: productId,
                                                quantity: quantitySelected
                                            });
                                            if (success) {
                                                toast.success(`Added ${quantitySelected}x ${name} to cart`);
                                            } else {
                                                toast.error(`Quantity requested exceeds available supply`);
                                            }
                                        }}
                                    >
                                        {
                                            availableQuantity && availableQuantity <= 0? 'Out of Stock' : 'Add to Cart'
                                        }
                                    </Button>
                                </div>
                            </>
                        ) : null
                    }
			        {
                        isPreview ? (
                            <div className='flex flex-col items-center lg:items-start w-full'>
                                <Link href={`/${category}/${productId}`} className="bg-dim-orange hover:opacity-80 text-white py-3 px-8 font-bold uppercase text-[13px] w-40">See product</Link>
                            </div>
                        ) : null
                    }
                </div>
            </section>
            {
                !isPreview ? (
                    <>
                        <section className='flex flex-col lg:flex-row'>
                            <div className='mt-11 lg:mt-0 lg:w-3/5 lg:mr-16'>
                                <h2 className='font-bold uppercase text-[24px] md:text-[32px] leading-[36px] md:tracking-[1.14px] mb-6'>Features</h2>
                                <p className='font-medium text-pretty whitespace-pre-line text-[15px] leading-[25px] opacity-50'>{ features }</p>
                            </div>
                            <div className='mt-20 lg:mt-0 lg:ml-16 flex flex-col md:flex-row lg:flex-col md:justify-between lg:justify-start md:w-[549px] lg:w-1/3'>
                                <h2 className='font-bold uppercase text-[24px] md:text-[32px] leading-[36px] mb-6'>In the box</h2>
                                <ol className='list-none'>
                                {
                                    includes ? includes.map((include: Item, index: number) => (
                                        <li key={index} className='flex flex-row items-start mb-2 last:mb-0'>
                                            <span className='font-bold text-dim-orange text-[15px] leading-[25px] w-1'>{ include.quantity }x</span>
                                            <span className='ml-10 font-medium text-[15px] leading-[25px] opacity-50'>{ include.item }</span>
                                        </li>
                                    )) : null
                                }
                                </ol>
                            </div>
                        </section>
                        <section className='mt-[88px]'>
                            <ol className='list-none md:grid grid-rows-2 grid-flow-col items-end gap-5'>
                                {
                                    Array.from({length: galleryImages || 3 }).map((_, index: number) => (
                                        <li className={index === 2 ? 'row-span-2 col-span-3' : `${index === 1 ? 'row-start-2' : 'row-span-1'} col-span-2`} key={index}>
                                            <ProductShowcase
                                                name={name} 
                                                path={`product-${productId}`} 
                                                target={`image-gallery-${(index + 1)}`} 
                                                styles={{ roundedEdges: true } as ShowcaseStyling}
                                            />
                                        </li>
                                    ))
                                }
                            </ol>
                        </section>
                        <ToastContainer autoClose={3000} />
                    </>
                ) : null
            }
        </div>
    );
}

interface RecommendedProductCardProps {
    recommendations: Array<RecommendedProduct>
}

export const RecommendedProductCard: FC<RecommendedProductCardProps> = ({ recommendations }) => {
    return (
        <section className='text-center md:mb-[120px]'>
            <h2 className='uppercase font-bold text-[24px] md:text-[32px] leading-[36px] tracking-[0.86px] mb-7 md:mb-14'>You may also like</h2>
            <ol className='list-none flex flex-col md:flex-row md:justify-evenly md:items-center'>
                {
                    recommendations.map((product: RecommendedProduct, index: number) => (
                        <li key={index} className='my-12 md:my-0 md:max-w-60'>
                            <div className='md:w-56 h-auto'>
                                <ProductShowcase name={product.name} path='shared' target={`image-${product.slug}`} />
                            </div>
                            <h3 className='truncate font-bold uppercase text-[24px] tracking-[1.71px] mb-8'>{ product.name }</h3>
                            <Link
                                className='bg-dim-orange text-white py-3 px-8 uppercase font-bold text-[13px] tracking-[1px]'
                                href={`/${product.category}/${product.slug}`}
                            >
                                See product
                            </Link>
                        </li>
                    ))
                }
            </ol>
        </section>
    );
}