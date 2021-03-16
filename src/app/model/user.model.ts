export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface User {
    name: string;
    email: string;
    phone: string;
    paymentGatewaySelected: string;
    address: Address;
}