export interface Item {
    quantity: number
    item: string
}

export interface CartItem {
    quantity: number
    name: string
    price: number
    slug: string
}

export interface RecommendedProduct {
    name: string
    slug: string
    category: string
}

export interface Product {
    id: number
    created?: string
    name: string
    slug: string
    description: string
    features: string
    category: string
    images: number
    new: boolean
    price: number
    quantity: number
    included: string | Array<Item>
    recommendations: string | Array<RecommendedProduct>
}

export interface Order {
    name: string
    email: string
    phone: string
    shippingAddress: string
    zipcode: string
    city: string
    country: string
    paymentMethod: string
}