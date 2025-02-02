import { type FC, useState } from "react";
import { Link } from 'react-aria-components';
import { StyledIconButton } from "./Button";
import { Navbar } from "./Navbar";

import { toggleCart, cartItems } from "../stores/cart";

import logo from '../assets/shared/desktop/logo.svg';

import { Cart } from "./Cart";
import { useStore } from "@nanostores/react";
import type { NavLink } from "../lib/constants";

interface HeaderStyles {
    backgroundColor: string
}

interface HeaderProps {
    navLinks: Array<NavLink>
    styles?: HeaderStyles
}

export const Header: FC<HeaderProps> = ({ navLinks, styles }) => {
    const [open, setOpen] = useState<boolean>(false);
    const items = useStore(cartItems);
    
    const toggleNav = () => setOpen(open ? false : true);

    return (
        <header className={`flex flex-col ${ styles && styles.backgroundColor ? styles.backgroundColor : 'bg-transparent' } absolute top-0 w-full`}>
            <div className='flex flex-row justify-evenly md:justify-between items-center px-8 md:px-12 lg:px-16 py-6 md:py-8'>
                <div className="flex flex-row justify-between items-center w-full md:w-56 lg:w-full">
                    <div className='lg:hidden'>
                        <StyledIconButton iconName="icon-hamburger" viewportModifier="tablet" altText="navbar icon" onPress={() => toggleNav()} />
                    </div>
                    <Link href="/"><img src={logo.src} alt="Audiophile Logo" loading="eager" /></Link>
                    <div className='w-auto lg:w-[429px] lg:mr-6'>
                        <Navbar isOpen={open} navLinks={navLinks} />
                    </div>
                </div>
                <div className="w-auto">
                    <StyledIconButton iconName="icon-cart" altText="shopping cart" onPress={() => toggleCart()} />
                    <Cart items={items} />
                </div>
            </div>
            <div className='h-2 md:mx-12 lg:mx-16 border-b border-b-light-gray opacity-20'></div>
        </header>
    )
}

export default Header;