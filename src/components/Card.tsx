import { type FC, useState, useEffect } from 'react';
import { Button, Link } from 'react-aria-components';

import iconArrowRight from '../assets/shared/desktop/icon-arrow-right.svg';
import { type Item, type RecommendedProduct } from '../lib/constants';
import { formatCurrency } from '../lib/common';
import { type ShowcaseStyling, ProductShowcase } from './Gallery';
import { QuantitySelectionButtonGroup } from './Button';

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
            <figure className='flex flex-col justify-center items-center'>
                { 
                    thumbnail ? <img src={thumbnail} className='-mt-16 w-auto h-[104px]' alt={`${category} thumbnail`} loading='lazy' /> : null 
                }
                <figcaption className='uppercase font-bold text-[15px] leading-normal tracking-[1.07px]'>{ category }</figcaption>
            </figure>
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
}

export const ProductCard: FC<ProductCardProps> = ({ 
    name, description, category, isPreview, features, productId, 
    isNew, price, galleryImages, availableQuantity, includes
}) => {
    // Temporary
    const [quantitySelected, setQuantitySelected] = useState<number>(1);

    const changeQuantity = (quantity: number) => {
        const available = availableQuantity || 1;

        if (quantity < 1 || quantity > available) {
            return;
        }
        
        setQuantitySelected(quantity);
    };

    return (
        <div className={!isPreview ? 'text-left' : 'text-center'}>
            <section className={!isPreview ? 'mb-11' : ''}>
                <ProductShowcase name={name} path={`product-${productId}`} target={`image-${isPreview ? 'category-page-preview' : 'product'}`} />
                {
                    isNew && !isPreview ? (
                        <p className='uppercase text-dim-orange text-[14px] tracking-[10px] my-3'>New product</p>
                    ) : null
                }
                {
                    isPreview ? (
                        <p className='uppercase text-dim-orange text-[14px] tracking-[10px] my-3'>New product</p>
                    ) : null
                }
			    <h2 className='font-bold uppercase text-[28px] tracking-[1px] my-3'>{ name }</h2>
                <p className='font-medium text-[15px] leading-[25px] opacity-50 mt-3 mb-8'>{ description }</p>
                {
                    !isPreview && price ? (
                        <>
                            <p className='font-bold text-[18px] tracking-[1.29px]'>{ formatCurrency(price) }</p>
                            <div className='flex flex-row justify-evenly items-center my-3'>
                                <QuantitySelectionButtonGroup 
                                    label='Quantity'
                                    value={quantitySelected}
                                    decrement={() => changeQuantity(quantitySelected - 1)}
                                    increment={() => changeQuantity(quantitySelected + 1)}
                                    isDisabled={availableQuantity === 0} 
                                />
                                <Button 
                                    type='button' 
                                    className='bg-dim-orange text-white py-3 px-8 font-bold uppercase text-[13px] tracking-[1px]'
                                    isDisabled={availableQuantity === 0}
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
                        <Link href={`/${category}/${productId}`} className="bg-dim-orange text-white py-3 px-8 font-bold uppercase text-[13px]">See product</Link>
                    ) : null
                }
            </section>
            {
                !isPreview ? (
                    <>
                        <section className='mt-11'>
                            <h2 className='font-bold uppercase text-[24px] leading-[36px] mb-6'>Features</h2>
                            <p className='font-medium text-pretty whitespace-pre-line text-[15px] leading-[25px] opacity-50'>{ features }</p>
                        </section>
                        <section className='mt-20'>
                            <h2 className='font-bold uppercase text-[24px] leading-[36px] mb-6'>In the box</h2>
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
                        </section>
                        <section className='mt-[88px]'>
                            <ol className='list-none'>
                                {
                                    Array.from({length: galleryImages || 3 }).map((_, index: number) => (
                                        <li key={index}>
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
        <section className='text-center'>
            <h2 className='uppercase font-bold text-[24px] leading-[36px] tracking-[0.86px]'>You may also like</h2>
            <ol className='list-none'>
                {
                    recommendations.map((product: RecommendedProduct, index: number) => (
                        <li key={index} className='my-16'>
                            <ProductShowcase name={product.name} path='shared' target={`image-${product.slug}`} />
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