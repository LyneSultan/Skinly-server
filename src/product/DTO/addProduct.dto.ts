export type AddProductDto ={
  name: string;
  price: number;
  rating?: number;
  description?: string;
  additional_info: {
    advertisement?: string;
  };
}
