import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-aria-components';

import iconArrowRight from '../assets/shared/desktop/icon-arrow-right.svg';

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

interface ProductCardPreviewProps {
    name: string
    description: string
    category: string
    productId: string
}

export const ProductCardPreview: FC<ProductCardPreviewProps> = ({ name, description, category, productId }) => {
    const [mobileThumbnail, setMobileThumbnail] = useState<string | null>(null);
    const [tabletThumbnail, setTabletThumbnail] = useState<string | null>(null);
    const [desktopThumbnail, setDesktopThumbnail] = useState<string | null>(null);

    const loadThumbnail = async (viewportModifier: string) => {
        let loadedThumbnail = null;

        try {
            loadedThumbnail = await import(`../assets/product-${productId}/${viewportModifier}/image-category-page-preview.jpg`);
        } catch (err) {
            console.error(err);
        }

        if (viewportModifier === 'mobile') {
            setMobileThumbnail(loadedThumbnail.default.src);
        } else if (viewportModifier === 'tablet') {
            setTabletThumbnail(loadedThumbnail.default.src);
        } else {
            setDesktopThumbnail(loadedThumbnail.default.src);
        }
    }

    useEffect(() => {
        loadThumbnail('mobile');
        loadThumbnail('tablet');
        loadThumbnail('desktop');
    }, []);

    return (
        <div className='text-center'>
            {
                mobileThumbnail && tabletThumbnail && desktopThumbnail ? 
                (
                    <figure className='bg-light-gray flex flex-col justify-center items-center mb-6'>
                        <picture>
                            <source srcSet={mobileThumbnail} media="(max-width: 767px)" />
                            <source srcSet={tabletThumbnail} media="(max-width: 1023px)" />
                            <source srcSet={desktopThumbnail} media="(min-width: 1024px)" />
                            <img className='w-[327px] h-auto' src={mobileThumbnail} alt={`${name} product preview`} loading='lazy' />
                        </picture>
			        </figure>
                ) : null
            }
			<p className='uppercase text-dim-orange text-[14px] tracking-[10px] my-3'>New product</p>
			<h2 className='font-bold uppercase text-[28px] tracking-[1px] my-3'>{ name }</h2>
            <p className='font-medium text-[15px] leading-[25px] opacity-50 mt-3 mb-8'>{ description }</p>
	
			<Link href={`/${category}/${productId}`} className="bg-dim-orange text-white py-3 px-8 font-bold uppercase text-[13px]">See product</Link>
        </div>
    );
}