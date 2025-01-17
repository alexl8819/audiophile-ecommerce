export interface Item {
    quantity: number
    item: string
}

export interface Product {
    id: number
    created: string
    name: string
    slug: string
    description: string
    features: string
    category: string
    new: boolean
    price: number
    included: string | Array<Item>
}