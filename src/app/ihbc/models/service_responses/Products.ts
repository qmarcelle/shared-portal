import { Product } from '../Product';
import { ServiceError } from './ServiceError';

export interface Products {
  products: Product[];
  serviceError: ServiceError;
}
