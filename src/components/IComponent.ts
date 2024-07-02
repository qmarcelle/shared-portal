export interface IComponent {
  className?: string;
  onClick?: () => void | Promise<void> | null;
  ariaLabel?: string;
  tabIndex?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any;
}
