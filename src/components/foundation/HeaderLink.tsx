import { ReactNode } from "react";
import Image from "next/image";
import { IComponent } from "../IComponent";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface HeaderLinkProps extends IComponent {
    title?: string
    label?: string
    icon: JSX.Element
    url: string
}

export const HeaderLink = ({ title, label, icon, url }: HeaderLinkProps) => {
    return <a className="flex mr-5 font-bold" href={url}>{icon}<span className="hidden lg:inline px-2 pt-2">{title}</span></a>
}