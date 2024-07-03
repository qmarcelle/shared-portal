import { AppProg } from './app_prog';

export interface ComponentDetails<T> {
  result: T;
  state: AppProg; //enum
  errors: string[];
}
