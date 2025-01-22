import { type FC } from 'react';
import { Form, TextField, Label, Input } from 'react-aria-components';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import type { Order } from '../../lib/constants';

interface OrderFormProps {}

export const OrderForm: FC<OrderFormProps> = () => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            shippingAddress: '',
            zipcode: '',
            city: '',
            country: '',
            paymentMethod: ''
        }
    });

    const onSubmit: SubmitHandler<Order> = () => {
        
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h2>Billing Details</h2>
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
                        className='flex flex-col'
                    >
                        <Label htmlFor={name} className='font-bold'>Name</Label>
                        <Input ref={ref} className='border border-dark-gray rounded-lg'  />
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
                        className='flex flex-col'
                    >
                        <Label htmlFor={name} className='font-bold'>Email</Label>
                        <Input type='email' ref={ref} className='border border-dark-gray rounded-lg'  />
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
                        className='flex flex-col'
                    >
                        <Label htmlFor={name} className='font-bold'>Phone</Label>
                        <Input type='tel' ref={ref} className='border border-dark-gray rounded-lg'  />
                    </TextField>
                )}
            />
            <h2>Shipping Info</h2>
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
                        className='flex flex-col'
                    >
                        <Label htmlFor={name} className='font-bold'>Shipping Address</Label>
                        <Input type='text' ref={ref} className='border border-dark-gray rounded-lg'  />
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
                        className='flex flex-col'
                    >
                        <Label htmlFor={name} className='font-bold'>ZIP code</Label>
                        <Input type='text' ref={ref} className='border border-dark-gray rounded-lg'  />
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
                        className='flex flex-col'
                    >
                        <Label htmlFor={name} className='font-bold'>City</Label>
                        <Input type='text' ref={ref} className='border border-dark-gray rounded-lg'  />
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
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        isRequired
                        validationBehavior="aria"
                        isInvalid={invalid}
                        className='flex flex-col'
                    >
                        <Label htmlFor={name} className='font-bold'>Country</Label>
                        <Input type='text' ref={ref} className='border border-dark-gray rounded-lg'  />
                    </TextField>
                )}
            />
            <Input type='submit' value='Place Order' />
        </Form>
    );
}