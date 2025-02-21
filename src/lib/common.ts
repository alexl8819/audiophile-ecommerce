import { ValidationViolationError, ServiceUnavailableError, UnknownError } from "./error";

export function formatCurrency (price: number, currency: string = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(price);
}

export function calculateTotal (subtotal: number, shippingFee: number, vatRate?: number) {
    return subtotal + (vatRate && vatRate > 0 ? subtotal * vatRate : 0) + shippingFee;
}

export async function validatePhone (phone: string, apiKey: string, apiBase: string, country?: string) {
    let phoneValidationResponse;

    try {
        phoneValidationResponse = await fetch(`${apiBase}/v1/?api_key=${apiKey}&phone=${phone}${country ? `&country=${country}` : ''}`);
    } catch (err) {
        console.error(err);
        throw new UnknownError('Unknown error has occured');
    }
    
    if (!phoneValidationResponse.ok) {
        console.error(phoneValidationResponse.status);
        throw new ServiceUnavailableError('Please try again');
    }

    const response = await phoneValidationResponse.json();

    if (!response['valid']) {
        throw new ValidationViolationError('Phone number provided is invalid');
    }
}

export async function validateEmail (email: string, apiKey: string, apiBase: string, allowDisposable = true) {
    let emailValidationResponse;

    try {
        emailValidationResponse = await fetch(`${apiBase}/v1/?api_key=${apiKey}&email=${email}`);
    } catch (err) {
        console.error(err);
        throw new UnknownError('Unknown error has occured');
    }

    if (!emailValidationResponse.ok) {
        console.error(emailValidationResponse.status);
        throw new ServiceUnavailableError(`Please try again.`);
    }

    const response = await emailValidationResponse.json();

    if (!response['is_valid_format']['value']) {
        throw new ValidationViolationError('Email uses an invalid format');
    }

    if (!allowDisposable && response['is_disposable_email']['value'] ) {
        throw new ValidationViolationError('Disposable email detected');
    }
}