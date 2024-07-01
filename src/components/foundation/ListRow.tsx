interface ListRowProps {
    label: JSX.Element,
    icon?: JSX.Element
}

export const ListRow = ({ label, icon }: ListRowProps) => {
    return <div className="flex flex-row justify-between m-2" >
        {label}
        {icon}
    </div>
}