export interface Image {
  name: string;
  size: number;
  type: string;
}

export interface Cabin {
  created_at?: string;
  description: string;
  discount: number;
  id: number;
  image?: string;
  maxCapacity: number;
  name: string;
  regularPrice: number;
}

export interface CabinFromUser {
  description: string;
  discount: number;
  id?: number;
  image?: Image | string;
  maxCapacity: number;
  name: string;
  regularPrice: number;
}
