import { type FC, memo } from 'react';

import { CategoryProductCard } from './Card';

interface NavigationMenuProps {
    categories: Array<string>
}

export const NavigationMenu: FC<NavigationMenuProps> = ({ categories }) => {
    return (
        <ol className="list-none flex flex-col space-y-16">
            {
                categories.map((category: string, index: number) => (
                    <li key={index} className="mx-6">
				        <CategoryProductCard category={category} url={`/${category}`} />
			        </li>
                ))
            }
		</ol>
    );
}

export default memo(NavigationMenu);