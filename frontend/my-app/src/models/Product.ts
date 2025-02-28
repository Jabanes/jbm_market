

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    user_id: number | null;  // Assuming user_id can be null if no user is associated
  }
  