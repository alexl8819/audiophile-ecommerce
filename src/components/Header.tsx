import type { FC } from "react";
import { StyledIconButton } from "./Button";

import logo from '../assets/shared/desktop/logo.svg';

interface HeaderProps {}

export const Header: FC<HeaderProps> = ({}) => {
    return (
        <header className="flex flex-row justify-evenly bg-black py-6">
            <StyledIconButton iconName="icon-hamburger" viewportModifier="tablet" altText="navbar icon" onPress={() => {}} />
            <img src={logo.src} alt="Audiophile Main Site Logo" loading="eager" />
            <StyledIconButton iconName="icon-cart" altText="shopping cart" onPress={() => {}} />
        </header>
    )
}

export default Header;