import { IComponent } from "../IComponent";

interface DividerProps extends IComponent {
    size?: number
    color?: string
    axis?: 'vertical' | 'horizontal',
}

export const Divider = ({ size = 1, color = '#CCCCCC', axis = 'vertical', className }: DividerProps) => {
    const width = axis === 'vertical' ? '100%' : size;
    const height = axis === 'horizontal' ? '100%' : size;
    return <div aria-label="divider" className={className || ''} style={{ width, height, backgroundColor: color }} />
}