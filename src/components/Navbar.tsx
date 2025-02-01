import { type FC } from 'react';
import { Link } from 'react-aria-components';

import { NavigationMenu } from './Menu';
import type { NavLink } from '../lib/constants';

interface NavbarProps {
    isOpen: boolean
    navLinks: Array<NavLink>
}

export const Navbar: FC<NavbarProps> = ({ isOpen, navLinks }) => {
    return (
        <div>
            <ol className='list-none hidden lg:flex flex-row justify-evenly items-center w-full'>
                {
                    navLinks.map((navLink: NavLink, index: number) => (
                        <li key={index} className='text-white hover:text-dim-orange uppercase font-bold text-[13px] leading-[25px] tracking-[2px]'>
                            <Link href={navLink.url}>{ navLink.name }</Link>
                        </li>
                    ))
                }
            </ol>
            {
                isOpen ? (
                    <div className='lg:hidden fixed inset-0 top-20 bg-dark-gray bg-opacity-40 overflow-y-scroll rounded-lg z-50'>
                        <div className='flex flex-col bg-white min-h-full py-16'>
                            <NavigationMenu categories={['Headphones', 'Speakers', 'Earphones']} />
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}