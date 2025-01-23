import { type FC } from 'react';
import { 
    Form, 
    TextField, 
    Label, 
    Input,
    Text,
    Select, 
    Button, 
    SelectValue,
    ListBox,
    ListBoxItem,
    Popover,
    FieldError,
    RadioGroup,
    Radio
} from 'react-aria-components';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { countries, type TCountryCode } from 'countries-list';
import type { Order } from '../../lib/constants';

interface OrderFormProps {}

const allowedContinents = ['NA', 'EU'];

const selectionItems = Object.keys(countries).filter((country) => (
    allowedContinents.includes(countries[country as TCountryCode].continent)
)).map((country) => ({
    label: countries[country as TCountryCode].name,
    value: country
}))

export const OrderForm: FC<OrderFormProps> = () => {
    const { control, handleSubmit } = useForm({
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
        
    }

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
                render={({
                    field: { name, value, onChange, onBlur, ref },
                    fieldState: { invalid, error }
                }) => (
                    <TextField 
                        name={name}
                        onChange={onChange}
                        onBlur={onBlur}
                        isRequired
                        validationBehavior="aria"
                        isInvalid={invalid}
                        className='flex flex-col'
                    >
                        <Select 
                            ref={ref} 
                            className='flex flex-col w-full' 
                        >
                            <Label htmlFor={name} className='font-bold text-[12px] tracking-[-0.21px] mb-2'>Country</Label>
                            <Button className='border border-lighter-gray py-3 px-6 rounded-lg'>
                                <SelectValue>
                                    {({defaultChildren, isPlaceholder}) => {
                                        return isPlaceholder ? <>Select Country</> : defaultChildren;
                                    }}
                                </SelectValue>
                            </Button>
                            <Text slot="description" />
                            <FieldError />
                            <Popover className='max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out'>
                                <ListBox
                                    items={selectionItems} 
                                    selectionMode='single'
                                >
                                    {
                                        selectionItems.map((item) => (
                                            <ListBoxItem value={value} className='p-1 hover:text-dim-orange cursor-pointer'>
                                                <Text slot="label">{ item.label }</Text>
                                            </ListBoxItem>
                                        ))
                                    }
                                </ListBox>
                            </Popover>    
                        </Select>
                    </TextField>
                )}
            />
            <h2 className='uppercase font-bold text-dim-orange text-[13px] leading-[25px] my-4'>Payment Details</h2>
            <Controller 
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
            />
            <Input type='submit' className='mt-8' value='Place Order' />
        </Form>
    );
}