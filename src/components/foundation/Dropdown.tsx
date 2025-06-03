import downIcon from '@/public/assets/down.svg';
import { useOutsideClickListener } from '@/utils/hooks/outside_click_listener';
import { useEffect, useRef, useState } from 'react';
import { checkBlueIcon } from './Icons';
import { Row } from './Row';
import { Spacer } from './Spacer';

export type SelectItem = {
  label: string;
  value: string;
};

interface DropDownProps {
  items: SelectItem[];
  onSelectCallback: (val: string) => void;
  initialSelectedValue: string;
  icon?: JSX.Element;
  showSelected?: boolean;
}

export const Dropdown = ({
  items,
  initialSelectedValue,
  onSelectCallback,
  showSelected = true,
  icon = <img src={downIcon} alt="down icon" />,
}: DropDownProps) => {
  const mappedItems = new Map(items.map((item) => [item.value, item.label]));
  const [selectedVal, setSelectedVal] = useState(initialSelectedValue);
  const [showDrop, setShowDrop] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    setSelectedVal(initialSelectedValue);
  }, [initialSelectedValue]);

  function onSelect(item: SelectItem) {
    setSelectedVal(item.value);
    onSelectCallback(item.value);
    setShowDrop(false);
  }

  useOutsideClickListener(listRef, () => {
    setShowDrop(false);
  });

  return (
    <div className="relative">
      <div
        className="flex flex-row link"
        onClick={() => setShowDrop((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setShowDrop((prev) => !prev);
          }
        }}
        tabIndex={0}
      >
        <p className="body-bold">{mappedItems.get(selectedVal)}</p>
        <Spacer axis="horizontal" size={8} />
        {icon}
      </div>
      <section
        ref={listRef}
        className="card-elevated z-20 dropdown-section"
        style={{ display: showDrop ? 'block' : 'none', position: 'absolute' }}
      >
        {items.map((item) => {
          const isSelcted = selectedVal == item.value && showSelected;
          return (
            <Row
              key={item.label}
              className={`${isSelcted ? 'dropdown-item-selected' : ''} dropdown-item p-2 cursor-pointer`}
            >
              {isSelcted ? (
                <div className="size-5 mx-2 ">
                  <img alt="selcted" className="size-5" src={checkBlueIcon} />
                </div>
              ) : (
                <div className={showSelected ? 'size-5 mx-2' : ''}></div>
              )}
              <div key={item.value} onClick={() => onSelect(item)}>
                <p className="whitespace-nowrap mx-2">{item.label}</p>
              </div>
            </Row>
          );
        })}
      </section>
    </div>
  );
};
