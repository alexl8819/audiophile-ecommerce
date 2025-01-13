import { type FC, useState, useEffect } from "react";
import { Button, type PressEvent } from "react-aria-components";

type PressFunction = (e: PressEvent) => void;

interface ButtonIconProps {
    text?: string
    iconName: string
    viewportModifier?: string
    altText: string
    onPress: PressFunction
}

export const StyledIconButton: FC<ButtonIconProps> = ({ iconName, altText, text, onPress, viewportModifier = 'desktop' }) => {
    const [icon, setIcon] = useState<string | null>(null);
    
    const loadIcon = async () => {
        let iconLoaded = null;

        try {
            iconLoaded = await import(`../assets/shared/${viewportModifier}/${iconName}.svg`);
        } catch (err) {
            console.error(err);
        }

        setIcon(iconLoaded.default.src);
    }
    
    useEffect(() => {
        loadIcon();
    }, []);

    return (
        <Button 
            type="button" 
            className={'flex flex-row justify-evenly items-center space-x-2'}
            onPress={onPress}
        >
            { 
                icon ? <img src={icon} alt={altText} loading="eager" /> : null
            }
            {
                text ? <span>{ text }</span> : null
            }
        </Button>
    );
}