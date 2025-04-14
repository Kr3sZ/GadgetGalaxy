import {CartProduct} from './cart-product';

export interface CartResponse {
  error: boolean;
  message: CartProduct[];
}
