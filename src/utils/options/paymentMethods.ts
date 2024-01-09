type PaymentMethodType = {
    id: number;
    name: string;
    value: string;
    fee: number;
};

export const paymentMethods: PaymentMethodType[] = [
    {
        id: 1,
        name: "Cash",
        value: "cash",
        fee: 1,
    },
    {
        id: 2,
        name: "Credit card",
        value: "credit-card",
        fee: 1.1,
    },
    {
        id: 3,
        name: "Debit card",
        value: "debit-card",
        fee: 1,
    },
    {
        id: 4,
        name: "Bank transfer",
        value: "bank-transfer",
        fee: 1,
    },
];
