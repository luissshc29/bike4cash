export type IBike = {
    id: number;
    image: string;
    name: string;
    price: number;
    category: "Performance" | "Leisure" | "Premium" | "Trail";
    recommended?: boolean;
    rating?: number;
};
