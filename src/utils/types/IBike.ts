import { IRating } from "./IRating";

export type IBike = {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  recommended?: boolean;
  rating?: {
    average: number;
    list: IRating[];
  };
};
