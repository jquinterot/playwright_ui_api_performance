export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

export interface ProductsData {
  phones: Product[];
  monitors: Product[];
  laptops: Product[];
}

export interface CustomerData {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export const customers: CustomerData[] = [
  {
    name: 'John Doe',
    country: 'USA',
    city: 'New York',
    card: '1234567890123456',
    month: '12',
    year: '2025',
  },
];
