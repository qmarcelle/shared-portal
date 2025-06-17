import { useOutsideClickListener } from '@/utils/hooks/outside_click_listener';
import Image from 'next/image';
import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { IComponent } from '../IComponent';
import { Card } from './Card';
import { Column } from './Column';
import { Header } from './Header';
import { checkBlueIcon, switchFilterIcon } from './Icons';
import { Row } from './Row';

export type RichSelectItem = {
  id: string;
  label: string;
  value: string;
  sortFn?: (a: any, b: any) => number; // Optional, for sorting use cases
};

interface RichDropDownProps<T> extends IComponent {
  headBuilder?: (val: T) => ReactNode;
  dropdownHeader?: ReactElement | null;
  dropdownFooter?: ReactElement;
  itemData: T[];
  itemsBuilder: (data: T, index: number, selected: T) => ReactNode;
  selected: T;
  onSelectItem: (val: T) => void;
  onClickFooter?: () => void;
  maxHeight?: string;
  minWidth?: string;
  showSelected?: boolean;
  divider?: boolean;
  disabled?: boolean;
  isMultipleItem?: boolean;
  domId?: string;
}

const DefaultDropDownHead = () => {
  return (
    <Row className="h-[72px] p-4 items-center divider-bottom">
      <Header className="grow" type="title-3" text="Switch to..." />
      <Image alt="" className="size-5" src={switchFilterIcon} />
    </Row>
  );
};

export const RichDropDown = <T extends { id: string }>({
  headBuilder,
  dropdownHeader = <DefaultDropDownHead />,
  dropdownFooter,
  itemData,
  isMultipleItem = false,
  itemsBuilder,
  selected,
  onSelectItem,
  maxHeight = 'max-h-[420px]',
  minWidth,
  showSelected = true,
  divider = true,
  onClickFooter,
  disabled = false,
  domId,
}: RichDropDownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef(null);
  const openDropDown = () => {
    if (!disabled && (itemData.length > 1 || isMultipleItem)) setIsOpen(true);
    else return;
  };

  const closeDropdown = () => {
    if (headBuilder) {
      setIsOpen(false);
    }
  };

  const selectItem = (val: T) => {
    onSelectItem(val);
    closeDropdown();
  };

  useOutsideClickListener(listRef, () => {
    if (selected.id !== '') {
      closeDropdown();
    }
  });

  useEffect(() => {
    if (!headBuilder) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className="rich-dropdown">
      {headBuilder && (
        <Column
          tabIndex={1}
          className={`switch-filter ${itemData.length > 1 || isMultipleItem ? 'default' : 'disabled'}`}
        >
          <div id={domId} onClick={openDropDown}>
            {headBuilder(selected)}
          </div>
        </Column>
      )}
      {isOpen && (
        <Card
          type="elevated"
          tabIndex={1}
          className={`switch-filter absolute-dropdown ${minWidth ?? 'min-w-[100%]'} ${selected.id == '' ? 'p-8' : ''} ${itemData.length > 1 ? 'default' : 'disabled'}`}
        >
          <div ref={listRef}>
            <div onClick={closeDropdown}>{dropdownHeader}</div>
            <ul
              className={`${maxHeight} ${minWidth ?? 'min-w-[100%]'} overflow-auto`}
            >
              {itemData.map((item, index) => {
                const isSelcted = selected.id == item.id && showSelected;
                const isSelectedId = selected.id == '';
                return (
                  <li key={item.id} className={`${isSelectedId ? 'mt-4' : ''}`}>
                    <Row
                      tabIndex={1}
                      className={`${isSelectedId ? '' : 'p-4'} ${divider ? 'divider-bottom' : ''} ${isSelcted ? 'selected' : ''} item`}
                      key={item.id}
                      onClick={() => selectItem(item)}
                    >
                      {isSelcted ? (
                        <div className="size-5 mr-2">
                          <Image
                            alt=""
                            className="size-5"
                            src={checkBlueIcon}
                          />
                        </div>
                      ) : (
                        <div
                          className={showSelected ? 'size-5 mr-2' : ''}
                        ></div>
                      )}
                      {itemsBuilder(item, index, selected)}
                    </Row>
                  </li>
                );
              })}
            </ul>
            <div onClick={() => onClickFooter?.()}>{dropdownFooter}</div>
          </div>
        </Card>
      )}
    </div>
  );
};
