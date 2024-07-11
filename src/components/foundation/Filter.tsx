import Image from 'next/image';
import { useState } from 'react';
import downIcon from '../../../public/assets/down.svg';
import resetIcon from '../../../public/assets/reset.svg';
import {
  FilterDetails,
  FilterDropDowndetails,
} from '../../models/filter_dropdown_details';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichDropDown } from '../foundation/RichDropDown';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
import { IComponent } from '../IComponent';

interface FilterProps extends IComponent {
  filterHeading: string;
  dropDown: FilterDropDowndetails[];
}

const FilterTile = ({ user }: { user: FilterDetails }) => {
  return (
    <Column className="border-none flex-grow">
      <TextBox type="body-1" text={`${user.label}`} />
    </Column>
  );
};

const FilterHead = ({ user }: { user: FilterDetails }) => {
  return (
    <div className="border-none">
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

export const Filter = ({ className, filterHeading, dropDown }: FilterProps) => {
  const [reset, resetFilter] = useState(false);
  const [dropDownList, setDropDownList] = useState(dropDown);

  const handleReset = () => {
    resetFilter(false);
    setDropDownList(dropDown);
  };

  const handleDropDownUpdate = (value: FilterDetails, index: number) => {
    const dropdDownCopiedVal = JSON.parse(JSON.stringify(dropDownList));
    if (dropdDownCopiedVal[index]) {
      dropdDownCopiedVal[index].selectedValue = value;
    }
    setDropDownList(dropdDownCopiedVal);
    resetFilter(true);
  };

  return (
    <Card className={className}>
      <Column>
        <Header className="title-2" text={filterHeading} />
        <Spacer size={32} />
        {dropDownList.slice(0, dropDownList.length).map((item, index) => (
          <>
            <Column key={index}>
              <div className="body-1">{item.dropNownName} </div>
              <Spacer size={5} />
              <div className="body-1 input">
                <RichDropDown<FilterDetails>
                  headBuilder={(val) => <FilterHead user={val} />}
                  itemData={item.dropDownval}
                  itemsBuilder={(data, index) => (
                    <FilterTile user={data} key={index} />
                  )}
                  selected={item.selectedValue}
                  onSelectItem={(val) => {
                    handleDropDownUpdate(val, index);
                  }}
                />
              </div>
            </Column>
            <Spacer size={16} />
          </>
        ))}
        <Spacer size={16} />
        {reset && (
          <a className="link flex !no-underline" href="#" onClick={handleReset}>
            <Image
              src={resetIcon}
              className="w-[20px] h-[20px] ml-2 mr-2 items-end"
              alt=""
            />
            Reset Filter
          </a>
        )}
      </Column>
    </Card>
  );
};
