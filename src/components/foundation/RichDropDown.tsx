import { ReactElement, ReactNode, useRef, useState } from "react";
import { IComponent } from "../IComponent";
import { Column } from "./Column";
import { Header } from "./Header";
import { checkBlueIcon, switchFilterIcon } from "./Icons";
import { Row } from "./Row";
import Image from 'next/image'
import { useOutsideClickListener } from "@/utils/outside_click_listener";

interface RichDropDownProps<T> extends IComponent {
    headBuilder: (val: T) => ReactNode
    dropdownHeader?: ReactElement | null
    dropdownFooter?: ReactElement
    itemData: T[]
    itemsBuilder: (data: T, index: number, selected: T) => ReactNode
    selected: T
    onSelectItem: (val: T) => void
}

const DefaultDropDownHead = () => {
    return <Row className="h-[72px] p-4 items-center divider-bottom">
        <Header className="grow" type="title-3" text="Switch to..." />
        <Image alt="switch" className="size-5" src={switchFilterIcon} />
    </Row>
}

export const RichDropDown = <T extends { id: string }>(
    { headBuilder, dropdownHeader = <DefaultDropDownHead />, dropdownFooter, itemData, itemsBuilder, selected, onSelectItem }: RichDropDownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false)
    const listRef = useRef(null)
    const openDropDown = () => {
        if (itemData.length < 2) {
            return
        }
        setIsOpen(true)
    }

    const closeDropdown = () => {
        setIsOpen(false)
    }

    const selectItem = (val: T) => {
        onSelectItem(val)
        closeDropdown()
    }

    useOutsideClickListener(listRef, () => {
        closeDropdown()
    })

    return <Column tabIndex={1} className={`switch-filter ${itemData.length > 1 ? 'default' : 'disabled'}`}>
        {isOpen == false && <div onClick={openDropDown}>{headBuilder(selected)}</div>}
        {isOpen && <div onClick={closeDropdown}>{dropdownHeader}</div>}
        <ul ref={listRef} className="max-h-[420px] overflow-y-scroll">
            {isOpen && itemData.map((item, index) => {
                const isSelcted = selected.id == item.id
                return <li key={item.id}>
                    <Row tabIndex={1}
                        className={`p-4 divider-bottom ${isSelcted ? 'selected' : ''} item`} key={item.id} onClick={() => selectItem(item)}>
                        <div className="size-5 mr-2" >
                            {isSelcted && <Image alt="selcted" className="size-5" src={checkBlueIcon} />}
                        </div>
                        {itemsBuilder(item, index, selected)}
                    </Row>
                </li>
            })}
        </ul>
        {isOpen && dropdownFooter}
    </Column>
}