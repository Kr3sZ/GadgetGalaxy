import {Product} from './product';

export interface ProductResponse {
  error: boolean;
  message: Product[];
}
