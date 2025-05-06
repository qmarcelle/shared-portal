import Image from 'next/image';
import { Fragment } from 'react';
import downIcon from '/assets/down.svg';
import resetIcon from '/assets/reset.svg';
import {
  FilterDetails,
  FilterItem,
} from '../../models/filter_dropdown_details';
import { IComponent } from '../IComponent';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichDropDown } from '../foundation/RichDropDown';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
import { Button } from './Button';
import { TextField } from './TextField';

interface FilterProps extends IComponent {
  filterHeading: string;
  filterItems: FilterItem[];
  onSelectCallback: (index: number, data: FilterItem[]) => void;
  showReset: boolean;
  onReset: () => void;
  buttons?: {
    type: 'primary';
    className: string;
    label: string;
    callback: (isClicked: boolean) => void | Promise<void> | null;
  };
}

export const FilterTile = ({ user }: { user: FilterDetails }) => {
  return (
    <Column className="border-none flex-grow">
      <TextBox type="body-1" text={`${user.label}`} />
    </Column>
  );
};

export const FilterHead = ({ user }: { user: FilterDetails }) => {
  return (
    <div className="body-1 input">
      <Row className="p-1 items-center">
        <FilterTile user={user} />
        <Image
          src={downIcon}
          className="w-[20px] h-[20px] ml-2 items-end"
          alt=""
        />
      </Row>
    </div>
  );
};

export const Filter = ({
  className,
  filterHeading,
  filterItems,
  buttons,
  showReset,
  onReset,
  onSelectCallback,
}: FilterProps) => {
  //const [filter, setFilter] = useState(filterItems);

  const handleDropDownUpdate = (
    selectedFilter: FilterDetails,
    index: number,
  ) => {
    const dropDownCopiedVal = JSON.parse(
      JSON.stringify(filterItems),
    ) as FilterItem[];
    if (dropDownCopiedVal[index]) {
      dropDownCopiedVal[index].selectedValue = selectedFilter;
    }

    onSelectCallback(index, dropDownCopiedVal);
  };

  const handleInputUpdate = (value: string, index: number) => {
    const filterList = JSON.parse(JSON.stringify(filterItems)) as FilterItem[];
    if (filterList[index]) {
      filterList[index].value = value;
    }
    onSelectCallback(index, filterList);
  };

  const handleCallback = () => {
    buttons?.callback(true);
  };

  return (
    <Card className={className}>
      <Column>
        <Header className="title-2" text={filterHeading} />
        <Spacer size={32} />
        {filterItems.slice(0, filterItems.length).map((item, index) => (
          <Fragment key={item.label}>
            <Column key={index}>
              {item.type == 'dropdown' ? (
                <div className="body-1">{item.label} </div>
              ) : null}
              <Spacer size={5} />
              {item.type == 'dropdown' ? (
                <div>
                  <RichDropDown<FilterDetails>
                    headBuilder={(val) => <FilterHead user={val} />}
                    itemData={item.value as FilterDetails[]}
                    itemsBuilder={(data, index) => (
                      <FilterTile user={data} key={index} />
                    )}
                    selected={item.selectedValue ?? ({} as FilterDetails)}
                    onSelectItem={(val) => {
                      handleDropDownUpdate(val, index);
                    }}
                  />
                </div>
              ) : null}
              {item.type == 'input' ? (
                <TextField
                  type="text"
                  label={item.label}
                  value={item.value as string}
                  valueCallback={(value) => {
                    handleInputUpdate(value, index);
                  }}
                ></TextField>
              ) : null}
            </Column>
            <Spacer size={16} />
          </Fragment>
        ))}
        <Spacer size={16} />
        {showReset && (
          <a className="link flex !no-underline" href="#" onClick={onReset}>
            <Image
              src={resetIcon}
              className="w-[20px] h-[20px] ml-2 mr-2 items-end"
              alt=""
            />
            Reset Filter
          </a>
        )}
        <Spacer size={16} />
        {buttons ? (
          <Button
            className={buttons.className}
            label={buttons.label}
            type={buttons.type}
            callback={() => handleCallback()}
          ></Button>
        ) : null}
      </Column>
    </Card>
  );
};
