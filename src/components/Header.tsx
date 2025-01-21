import { type FC } from "react";
import { Link } from 'react-aria-components';
import { StyledIconButton } from "./Button";

import { toggleCart, cartItems } from "../stores/cart";

import logo from '../assets/shared/desktop/logo.svg';

import { Cart } from "./Cart";
import { useStore } from "@nanostores/react";

interface HeaderProps {}

export const Header: FC<HeaderProps> = ({}) => {
    const items = useStore(cartItems);
    
    return (
        <header className="flex flex-row justify-evenly bg-black py-6">
            <StyledIconButton iconName="icon-hamburger" viewportModifier="tablet" altText="navbar icon" onPress={() => {}} />
            <Link href="/"><img src={logo.src} alt="Audiophile Logo" loading="eager" /></Link>
            <StyledIconButton iconName="icon-cart" altText="shopping cart" onPress={() => toggleCart()} />
            <Cart items={items} />
        </header>
    )
}

export default Header;