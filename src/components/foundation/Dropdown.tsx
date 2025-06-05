import downIcon from '@/public/assets/down.svg';
import { useOutsideClickListener } from '@/utils/hooks/outside_click_listener';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { resolveMaxWidth } from '../MaxWidthResolver';
import { checkBlueIcon } from './Icons';
import { Row } from './Row';
import { Spacer } from './Spacer';

export type SelectItem = {
  label: string;
  value: string;
};

export interface DropDownProps {
  label?: string;
  items: SelectItem[];
  onSelectCallback: (val: string) => void;
  initialSelectedValue: string;
  icon?: JSX.Element;
  showSelected?: boolean;
  className?: string;
  error?: string;
  maxWidth?: number | string; // Allow both number and string for flexibility
  iconAlignment?: 'flex' | 'right'; // New prop for icon alignment
  scrollThreshold?: number; // New prop for scroll threshold
  disabled?: boolean;
}

export const Dropdown = ({
  label,
  items,
  initialSelectedValue,
  onSelectCallback,
  showSelected = true,
  icon = <Image src={downIcon} alt="" />,
  className = '',
  error,
  maxWidth,
  iconAlignment = 'flex', // Default to 'flex'
  scrollThreshold = 10, // Default threshold for scrollable dropdown
  disabled,
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

  const resolvedMaxWidth = resolveMaxWidth(maxWidth);

  const isScrollable = items.length > scrollThreshold;

  return (
    <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
      {label != undefined && label}
      <div
        className={`flex flex-row link ${className}`}
        onClick={disabled ? undefined : () => setShowDrop((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setShowDrop((prev) => !prev);
          }
        }}
        tabIndex={0}
        style={{ ...(resolvedMaxWidth && { maxWidth: resolvedMaxWidth }) }}
      >
        <p className="body-bold">{mappedItems.get(selectedVal)}</p>
        <Spacer axis="horizontal" size={8} />
        {iconAlignment === 'flex' ? (
          icon
        ) : (
          <div style={{ marginLeft: 'auto' }}>{icon}</div> // Right-aligned icon
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <section
        ref={listRef}
        className="card-elevated z-20 dropdown-section overflow-y-auto"
        style={{
          display: showDrop ? 'block' : 'none',
          position: 'absolute',
          ...(isScrollable && { maxHeight: '350px', overflowY: 'auto' }), // Add scrollable styles
        }}
      >
        {items.map((item) => {
          const isSelcted = selectedVal == item.value && showSelected;
          return (
            <Row
              key={item.label}
              onClick={() => onSelect(item)}
              className={`${isSelcted ? 'dropdown-item-selected' : ''} dropdown-item p-2 cursor-pointer`}
            >
              {isSelcted ? (
                <div className="size-5 mx-2 ">
                  <Image alt="" className="size-5" src={checkBlueIcon} />
                </div>
              ) : (
                <div className={showSelected ? 'size-5 mx-2' : ''}></div>
              )}
              <div key={item.value}>
                <p className="whitespace-nowrap mx-2">{item.label}</p>
              </div>
            </Row>
          );
        })}
      </section>
    </div>
  );
};
