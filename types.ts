
export type UserRole = 'ARTISAN' | 'BUYER' | null;
export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'mr' | 'te' | 'gu' | 'ur' | 'kn' | 'or' | 'ml' | 'pa' | 'as' | 'mai' | 'sat' | 'ks' | 'ne' | 'kok' | 'sd' | 'doi' | 'mni' | 'sa' | 'brx';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  artisanName: string;
  location: string;
  imageUrl: string;
  story: string;
  groundingSources?: GroundingSource[];
  createdAt: number;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  price: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: number;
}

export interface ArtisanProfile {
  name: string;
  location: string;
  craftType: string;
  earnings: number;
}
