import { type FC, memo } from 'react';

import { CategoryProductCard } from './Card';

interface NavigationMenuProps {
    categories: Array<string>
}

export const NavigationMenu: FC<NavigationMenuProps> = ({ categories }) => {
    return (
        <ol className="list-none flex flex-col md:flex-row justify-evenly space-y-16 md:space-y-0 md:px-4">
            {
                categories.map((category: string, index: number) => (
                    <li key={index} className="mx-6 md:mx-[10px] md:w-full">
				        <CategoryProductCard category={category} url={`/${category}`} />
			        </li>
                ))
            }
		</ol>
    );
}

export default memo(NavigationMenu);