import { memo } from 'react';

export const IconButtonSkeleton = memo(() => {
    return (<div className='bg-dark-gray w-6 h-6 rounded-full animate-pulse'></div>)
});

export const CategoryDisplaySkeleton = memo(() => {
    return (
        <>
            <div className='bg-dark-gray w-20 h-20 rounded-full animate-pulse'></div>
            <div className='bg-dark-gray w-24 h-6 animate-pulse mt-2'></div>
        </>
    );
});

export const ProductDisplaySkeleton = memo(() => {
    return (<div className='bg-dark-gray w-full h-[352px] animate-pulse'></div>);
});