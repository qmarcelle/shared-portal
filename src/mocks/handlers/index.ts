import { chatHandlers } from './chatHandlers';
import { memberHandlers } from './memberHandlers';

export const handlers = [...chatHandlers, ...memberHandlers];
