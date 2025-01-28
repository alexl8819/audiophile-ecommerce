import { type FC, memo, useState, useEffect, type PropsWithChildren } from "react";
import { Button, Input, NumberField, Label, Group, type PressEvent } from "react-aria-components";

type PressFunction = (e: PressEvent) => void;

interface ButtonIconProps {
    text?: string
    iconName: string
    viewportModifier?: string
    altText: string
    onPress: PressFunction
}

export const StyledIconButton: FC<ButtonIconProps> = memo(({ iconName, altText, text, onPress, viewportModifier = 'desktop' }) => {
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
});

interface QuantitySelectionButtonGroupProps {
    label: string
    isDisabled: boolean
    value: number
    increment: () => void
    decrement: () => void
}

export const QuantitySelectionButtonGroup: FC<QuantitySelectionButtonGroupProps> = ({ label, value, increment, decrement, isDisabled }) => {
    return (
        <NumberField className='bg-light-gray'>
            <Label className='sr-only'>{ label } </Label>
            <Group>
                <Button 
                    slot='decrement' 
                    type='button' 
                    className='w-3'
                    onPress={decrement}
                    isDisabled={isDisabled}
                >
                    -
                </Button>
                <Input
                    type='number' 
                    value={value} 
                    className='w-12 bg-light-gray text-center cursor-pointer'
                    readOnly={true}
                />
                <Button 
                    slot='increment' 
                    type='button' 
                    className='w-3'
                    onPress={increment}
                    isDisabled={isDisabled}
                >
                    +
                </Button>
            </Group>
        </NumberField>
    );
}

export enum NavigationMethod {
    Back = 0
}

interface NavigationButtonProps extends PropsWithChildren {
    method: NavigationMethod
}

export const NavigationButton: FC<NavigationButtonProps> = ({ method, children }) => {
    const [_window, setWindow] = useState<Window | null>(null);
    
    const handleNav = () => {
        if (_window && method === NavigationMethod.Back) {
            _window.history.back();
        }
    }

    useEffect(() => {
        if (typeof window !== undefined) {
            setWindow(window);
        }
    }, []);

    return (
        <Button onPress={handleNav}>
            { children }
        </Button>
    );
}