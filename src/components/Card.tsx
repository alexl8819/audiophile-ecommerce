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