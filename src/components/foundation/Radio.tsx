export interface RadioProps {
    selected: boolean
    callback?: ((val: any) => void) | null
    label: string
    subLabel?: string
    value?: any
}

export const Radio = ({ selected, label, callback, value, subLabel }: RadioProps) => {
    return <div onClick={() => callback?.(value)} className={`flex flex-row gap-1 ${callback == null ? 'checkbox-disabled' : ''}`}>
    <label>
    <input aria-label={label} type="radio" name="" id="" checked={selected} />
    </label>
    <div className="flex-col mb-3">
        <p className={`${subLabel != null ? 'font-bold' : ''}`}>{label}</p>
        {subLabel && <p>{subLabel}</p>}
    </div>
</div>
   

}
