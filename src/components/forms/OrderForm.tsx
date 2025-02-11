import { type FC, type PropsWithChildren } from 'react';
import { 
    Form, 
    TextField, 
    Label, 
    Input
} from 'react-aria-components';
import {
    PaymentElement,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js';
import { usePlacesWidget } from 'react-google-autocomplete';
import Select, { type SingleValue } from 'react-select';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { countries, type TCountryCode } from 'countries-list';
import type { Order, ValidationResponse } from '../../lib/constants';

const allowedContinents = ['NA', 'EU'];

type CountrySelection = {
    label: string
    value: string
}

const selectionItems: Array<CountrySelection> = Object.keys(countries).filter((country) => (
    allowedContinents.includes(countries[country as TCountryCode].continent)
)).map((country) => ({
    label: countries[country as TCountryCode].name,
    value: country
}));

interface OrderFormProps extends PropsWithChildren {
    onCountrySet: (countryCode: string) => void
    onFinish: (success: boolean) => void
}

export const OrderForm: FC<OrderFormProps> = ({ children, onCountrySet, onFinish }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            shippingAddress: '',
            zipcode: '',
            city: '',
            country: {
                label: '',
                value: ''
            },
            paymentMethod: ''
        }
    });

    const { ref: aRef } = usePlacesWidget({
        apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY,
        onPlaceSelected: (place) => {
            console.log(place);
            const streetNum = place.address_components.find((component: any) => component.types.includes('street_number'))['long_name'];
            const streetAddress = place.address_components.find((component: any) => component.types.includes('route'))['long_name'];
            const city = place.address_components.find((component: any) => component.types.includes('locality') || component.types.includes('postal_town'))['long_name'];
            const postalCode = place.address_components.find((component: any) => component.types.includes('postal_code'))['long_name'];
            const country = place.address_components.find((component: any) => component.types.includes('country'))['short_name'];

            setValue('shippingAddress', `${streetNum} ${streetAddress}`);
            setValue('city', city)
            setValue('zipcode', postalCode);
            setValue('country', selectionItems.find((item) => item.value.toLowerCase() === country.toLowerCase()) || selectionItems[0]);

            onCountrySet(country.toLowerCase());
        },
        options: {
            types: ["address"],
            // componentRestrictions: { country: selectionItems.map((item) => item.value.toLowerCase()) }, // Only 5 allowed per docs
        }
    });

    const isPhoneValid = async (phone: string) => {
        if (phone.length < 11) {
            return 'Phone must be at least 10 digits';
        }
        
        let phoneValidation;

        try {
            phoneValidation = await fetch(`/api/validation`, {
                method: 'POST',
                body: JSON.stringify({
                    resource: 'phone',
                    value: phone
                })
            });
        } catch (err) {
            console.error(err);
            return false;
        }

        const validation: ValidationResponse = await phoneValidation.json();

        if (validation.error) {
            return validation.error;
        }

        return true;
    }

    const isEmailValid = async (email: string) => {
        if (!email.length || email.length <= 5) {
            return 'Email must be at least five characters';
        }

        let emailValidation;

        try {
            emailValidation = await fetch(`/api/validation`, {
                method: 'POST',
                body: JSON.stringify({
                    resource: 'email',
                    value: email,
                    options: {
                        strict: true
                    }
                })
            });
        } catch (err) {
            console.error(err);
            return false;
        }

        const validation: ValidationResponse = await emailValidation.json();

        if (!validation.error) {
            return validation.error;
        }

        return true;
    }

    const onSubmit: SubmitHandler<Order> = () => {
        // TODO: call /order endpoint
    }

    const dot = () => ({
        padding: '8px 12px'
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className='flex flex-col lg:flex-row mx-8 lg:mx-0'>
            <div className='lg:w-3/4 lg:mr-4 bg-white lg:px-12 lg:pt-4 lg:pb-8 lg:rounded-lg'>
                <h2 className='uppercase font-bold text-dim-orange text-[13px] leading-[25px] mb-4'>Billing Details</h2>
                <div className='flex flex-col'>
                    <div className='flex flex-col md:flex-row md:justify-evenly md:space-x-4 md:mb-4'>
                        <Controller 
                            control={control}
                            name='name'
                            rules={{ required: 'Name is required.', pattern: /^[A-Z][a-z]+ [A-Z][a-z]+$/, minLength: 5 }}
                            render={({
                                field: { name, value, onChange, onBlur, ref },
                                fieldState: { invalid, error }
                            }) => (
                                <TextField 
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    isRequired
                                    validationBehavior="aria"
                                    isInvalid={invalid}
                                    className='flex flex-col mb-3 md:mb-0 w-full'
                                >
                                    <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>
                                        Name
                                    </Label>
                                    <Input 
                                        ref={ref}
                                        className='border border-lighter-gray py-3 px-6 rounded-lg' 
                                        placeholder='John Smith'
                                    />
                                    {invalid && error && <p>{error.message}</p>}
                                </TextField>
                            )}
                        />
                        <Controller 
                            control={control}
                            name='email'
                            rules={{ required: 'Email is required.', validate: isEmailValid }}
                            render={({
                                field: { name, value, onChange, onBlur, ref },
                                fieldState: { invalid, error }
                            }) => (
                                <TextField 
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    isRequired
                                    validationBehavior="aria"
                                    isInvalid={invalid}
                                    className='flex flex-col my-3 md:my-0 w-full'
                                >
                                    <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Email</Label>
                                    <Input
                                        ref={ref}
                                        type='email' 
                                        className='border border-lighter-gray py-3 px-6 rounded-lg' 
                                        placeholder='johnsmith@gmail.com'
                                    />
                                    {invalid && error && <p>{error.message}</p>}
                                </TextField>
                            )}
                        />
                    </div>
                    <Controller 
                        control={control}
                        name='phone'
                        rules={{ required: 'Phone is required.', validate: isPhoneValid }}
                        render={({
                            field: { name, value, onChange, onBlur, ref },
                            fieldState: { invalid, error }
                        }) => (
                            <TextField 
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                isRequired
                                validationBehavior="aria"
                                isInvalid={invalid}
                                className='flex flex-col mt-3 md:mt-0 md:w-1/2 md:pr-2'
                            >
                                <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Phone</Label>
                                <Input
                                    ref={ref}
                                    type='tel'
                                    className='border border-lighter-gray py-3 px-6 rounded-lg' 
                                    placeholder='555-555-5555'
                                />
                                {invalid && error && <p>{error.message}</p>}
                            </TextField>
                        )}
                    />
                </div>
                <h2 className='uppercase font-bold text-dim-orange text-[13px] leading-[25px] my-4'>Shipping Info</h2>
                <Controller 
                    control={control}
                    name='shippingAddress'
                    rules={{ required: 'Shipping Address is required.' }}
                    render={({
                        field: { name, value, onChange, onBlur, ref },
                        fieldState: { invalid, error }
                    }) => (
                        <>
                            <TextField 
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                isRequired
                                validationBehavior="aria"
                                isInvalid={invalid}
                                className='flex flex-col mb-3'
                            >
                                <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Address</Label>
                                <Input 
                                    type='text' 
                                    ref={(e: any) => {
                                        ref(e);
                                        aRef.current = e;
                                    }} 
                                    className='border border-lighter-gray py-3 px-6 rounded-lg' 
                                    placeholder='1137 Williams Avenue'
                                />
                                {invalid && error && <p>{error.message}</p>}
                            </TextField>
                        </>
                    )}
                />
                <div className='flex flex-col'>
                    <div className='flex flex-col md:flex-row md:justify-evenly md:space-x-4 md:mb-4'>
                        <Controller 
                            control={control}
                            name='zipcode'
                            rules={{ required: 'Zipcode is required.' }}
                            render={({
                                field: { name, value, onChange, onBlur, ref },
                                fieldState: { invalid, error }
                            }) => (
                                <TextField 
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    isRequired
                                    validationBehavior="aria"
                                    isInvalid={invalid}
                                    className='flex flex-col mb-3 md:mb-0 w-full'
                                >
                                    <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>ZIP code</Label>
                                    <Input 
                                        type='text' 
                                        ref={ref}
                                        className='border border-lighter-gray py-3 px-6 rounded-lg'
                                        placeholder='10001' 
                                    />
                                    {invalid && error && <p>{error.message}</p>}
                                </TextField>
                            )}
                        />
                        <Controller 
                            control={control}
                            name='city'
                            rules={{ required: 'City is required.' }}
                            render={({
                                field: { name, value, onChange, onBlur, ref },
                                fieldState: { invalid, error }
                            }) => (
                                <TextField 
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    isRequired
                                    validationBehavior="aria"
                                    isInvalid={invalid}
                                    className='flex flex-col mb-3 md:mb-0 w-full'
                                >
                                    <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>City</Label>
                                    <Input 
                                        type='text' 
                                        ref={ref} 
                                        className='border border-lighter-gray py-3 px-6 rounded-lg'
                                        placeholder='New York' 
                                    />
                                    {invalid && error && <p>{error.message}</p>}
                                </TextField>
                            )}
                        />
                </div>
                <Controller 
                    control={control}
                    name='country'
                    rules={{ required: 'Country is required.' }}
                    render={({ field }) => (
                        <>
                            <Label htmlFor={field.name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Country</Label>
                            <Select
                                {...field}
                                className="pt-2 md:mt-0 md:w-1/2 md:pr-2"
                                styles={{
                                    control: (styles) => ({ ...styles, ...dot() }),
                                }}
                                // defaultValue={{ label: 'United States', value: 'us' }}
                                isClearable={false}
                                isSearchable={true}
                                options={selectionItems}
                                onChange={(newVal: SingleValue<CountrySelection>) => {
                                    if (newVal) {
                                        // Update VAT rate dynamically for cart preview
                                        onCountrySet(newVal.value);
                                    }
                                    field.onChange(newVal);
                                }}
                            />
                        </>
                    )}
                />
                </div>
                <h2 className='uppercase font-bold text-dim-orange text-[13px] leading-[25px] my-4'>Payment Details</h2>
                <PaymentElement />
            </div>
            <div className='lg:w-1/3 lg:ml-4 bg-white lg:px-8 lg:py-4 lg:rounded-lg'>
                { children }
                <Input type='submit' className='mt-8 py-4 px-2 bg-dim-orange text-white font-bold uppercase w-full' value='Continue & Pay' />
            </div>
        </Form>
    );
}