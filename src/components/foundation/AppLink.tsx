import { ReactNode } from "react"
import { IComponent } from "../IComponent"

export interface LinkProps extends IComponent {
    url?: string
    label: string
    icon?: ReactNode | null
    border ?: boolean
    callback?: () => void
}

export const AppLink = ({ label, icon, url, border = true, callback, className }: LinkProps) => {
    return <a className={`block ${className}`.trimEnd()} href={url}>
        <button onClick={callback} style={{ maxWidth: 'max-content', height: 'auto' }} tabIndex={0} className={`flex flex-row ${border && "link-container"}`}>
            <p className="link">{label}</p>
            {icon && <p className="ml-1">{icon}</p>}
        </button>
    </a>
}