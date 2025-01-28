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
import Select, { type SingleValue } from 'react-select';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { countries, type TCountryCode } from 'countries-list';
import type { Order } from '../../lib/constants';

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
    
    const { control, handleSubmit, watch } = useForm({
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

    const onSubmit: SubmitHandler<Order> = () => {
        // TODO: call /order endpoint
    }

    const dot = () => ({
        padding: '8px 12px'
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h2 className='uppercase font-bold text-dim-orange text-[13px] leading-[25px] mb-4'>Billing Details</h2>
            <Controller 
                control={control}
                name='name'
                rules={{ required: 'Name is required.' }}
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
                        className='flex flex-col mb-3'
                    >
                        <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Name</Label>
                        <Input 
                            ref={ref} 
                            className='border border-lighter-gray py-3 px-6 rounded-lg' 
                            placeholder='John Smith'
                        />
                    </TextField>
                )}
            />
            <Controller 
                control={control}
                name='email'
                rules={{ required: 'Email is required.' }}
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
                        className='flex flex-col my-3'
                    >
                        <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Email</Label>
                        <Input 
                            type='email' 
                            ref={ref} 
                            className='border border-lighter-gray py-3 px-6 rounded-lg' 
                            placeholder='johnsmith@gmail.com'
                        />
                    </TextField>
                )}
            />
            <Controller 
                control={control}
                name='phone'
                rules={{ required: 'Phone is required.' }}
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
                        className='flex flex-col mt-3'
                    >
                        <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Phone</Label>
                        <Input 
                            type='tel' 
                            ref={ref} 
                            className='border border-lighter-gray py-3 px-6 rounded-lg' 
                            placeholder='555-555-5555'
                        />
                    </TextField>
                )}
            />
            <h2 className='uppercase font-bold text-dim-orange text-[13px] leading-[25px] my-4'>Shipping Info</h2>
            <Controller 
                control={control}
                name='shippingAddress'
                rules={{ required: 'Shipping Address is required.' }}
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
                        className='flex flex-col mb-3'
                    >
                        <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Address</Label>
                        <Input 
                            type='text' 
                            ref={ref} 
                            className='border border-lighter-gray py-3 px-6 rounded-lg' 
                            placeholder='1137 Williams Avenue'
                        />
                    </TextField>
                )}
            />
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
                        className='flex flex-col mb-3'
                    >
                        <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>ZIP code</Label>
                        <Input 
                            type='text' 
                            ref={ref}
                            className='border border-lighter-gray py-3 px-6 rounded-lg'
                            placeholder='10001' 
                        />
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
                        className='flex flex-col mb-3'
                    >
                        <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>City</Label>
                        <Input 
                            type='text' 
                            ref={ref} 
                            className='border border-lighter-gray py-3 px-6 rounded-lg'
                            placeholder='New York' 
                        />
                    </TextField>
                )}
            />
            <Controller 
                control={control}
                name='country'
                rules={{ required: 'Country is required.' }}
                render={({ field }) => (
                    <>
                        <Label htmlFor={field.name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Country</Label>
                        <Select
                            {...field}
                            className="pt-2"
                            styles={{
                                control: (styles) => ({ ...styles, ...dot() }),
                            }}
                            defaultValue={selectionItems[1]}
                            isClearable={false}
                            isSearchable={true}
                            options={selectionItems}
                            onChange={(newVal: SingleValue<CountrySelection>) => {
                                field.onChange(newVal);
                                if (newVal) {
                                    // Update VAT rate dynamically for cart preview
                                    onCountrySet(newVal.value);
                                }
                            }}
                        />
                    </>
                )}
               
            />
            <h2 className='uppercase font-bold text-dim-orange text-[13px] leading-[25px] my-4'>Payment Details</h2>
            {/*<Controller 
                control={control}
                name='paymentMethod'
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
                        className='flex flex-col mb-3'
                    >
                        <RadioGroup className='flex flex-col'>
                            <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Payment Method</Label>
                            <Radio 
                                value="paypal"
                                className={({ isFocusVisible, isSelected, isPressed }) => `
                                    group relative flex cursor-pointer px-4 py-3 rounded-lg border border-solid
                                    ${isFocusVisible ? 'ring-2 ring-dim-orange ring-offset-1 ring-offset-white/80' : ''}${isSelected ? 'bg-dim-orange border-white/30 font-bold text-white' : 'border-lighter-gray'}
                                    ${isPressed && !isSelected ? 'bg-orange-50' : ''}${!isSelected && !isPressed ? 'bg-white' : ''}`}
                            >
                                PayPal
                            </Radio>
                            <Radio 
                                value="credit"    
                                className={({ isFocusVisible, isSelected, isPressed }) => `
                                    group relative flex cursor-pointer px-4 py-3 my-3 rounded-lg border border-solid
                                    ${isFocusVisible ? 'ring-2 ring-dim-orange ring-offset-1 ring-offset-white/80' : ''}${isSelected ? 'bg-dim-orange border-white/30 font-bold text-white' : 'border-lighter-gray'}
                                    ${isPressed && !isSelected ? 'bg-orange-50' : ''}${!isSelected && !isPressed ? 'bg-white' : ''}`}
                            >
                                Credit Card
                            </Radio>
                            <Radio 
                                value="cash"
                                className={({ isFocusVisible, isSelected, isPressed }) => `
                                    group relative flex cursor-pointer px-4 py-3 rounded-lg border border-solid
                                    ${isFocusVisible ? 'ring-2 ring-dim-orange ring-offset-1 ring-offset-white/80' : ''}${isSelected ? 'bg-dim-orange border-white/30 font-bold text-white' : 'border-lighter-gray'}
                                    ${isPressed && !isSelected ? 'bg-orange-50' : ''}${!isSelected && !isPressed ? 'bg-white' : ''}`}
                            >
                                Cash
                            </Radio>
                        </RadioGroup>
                    </TextField>
                )}
            />*/}
            <PaymentElement />
            { children }
            <Input type='submit' className='mt-8 py-4 px-2 bg-dim-orange text-white font-bold uppercase w-full' value='Continue & Pay' onClick={() => onFinish(true)} />
        </Form>
    );
}