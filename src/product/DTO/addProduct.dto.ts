export type AddProductDto ={
  name: string;
  price: number;
  rating?: number;
  link: string;
  description?: string;
  additional_info: {
    advertisement?: string;
  };
}
