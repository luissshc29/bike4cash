export type ITransaction = {
    username: string;
    bikeId: number;
    paymentMethod: string;
    installments: number;
    initialDate: string;
    finalDate: string;
    totalPrice: number;
    transactionDate: string;
};
