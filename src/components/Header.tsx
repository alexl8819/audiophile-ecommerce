import { type FC } from "react";
import { Link } from 'react-aria-components';
import { StyledIconButton } from "./Button";

import logo from '../assets/shared/desktop/logo.svg';

interface HeaderProps {}

export const Header: FC<HeaderProps> = ({}) => {
    // const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <header className="flex flex-row justify-evenly bg-black py-6">
            <StyledIconButton iconName="icon-hamburger" viewportModifier="tablet" altText="navbar icon" onPress={() => {}} />
            <Link href="/">
                <img src={logo.src} alt="Audiophile Logo" loading="eager" />
            </Link>
            <StyledIconButton iconName="icon-cart" altText="shopping cart" onPress={() => {}} />
        </header>
    )
}

export default Header;