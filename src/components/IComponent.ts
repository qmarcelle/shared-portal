export interface IComponent {
    className?: string
    onClick?: () => void | Promise<void> | null
    ariaLabel?: string
    tabIndex?: number,
    ref?: any
}