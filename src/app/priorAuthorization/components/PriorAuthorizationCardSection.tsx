import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from '@/components/foundation/Pagination';
import {
  RichDropDown,
  RichSelectItem,
} from '@/components/foundation/RichDropDown';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import downIcon from '../../../../public/assets/down.svg';
import { MemberPriorAuthDetail } from '../models/priorAuthData';
import { usePriorAuthStore } from '../store/priorAuthStore';
import { mapToPriorAuthDetails } from '../utils/priorAuthMapper';
import { PriorAuthItem } from './PriorAuthItem';

interface PriorAuthCardProps extends IComponent {
  priorAuthDetails: MemberPriorAuthDetail[];
  sortBy: RichSelectItem[];
}

export const PriorAuthorizationCardSection = ({
  priorAuthDetails,
  sortBy,
}: PriorAuthCardProps) => {
  const router = useRouter();
  const [selectedSort, setSelectedSort] = useState(sortBy[0]);
  const [priorAuthList, setPriorAuthList] = useState<MemberPriorAuthDetail[]>(
    [...priorAuthDetails].sort(selectedSort.sortFn),
  );
  const { setSelectedPriorAuth } = usePriorAuthStore();
  useEffect(() => {
    if (selectedSort.sortFn) {
      const sortedList = [...priorAuthDetails].sort(selectedSort.sortFn);
      console.log('SortedList', sortedList);
      setPriorAuthList(sortedList);
    } else {
      setPriorAuthList(priorAuthDetails);
    }
  }, [selectedSort, priorAuthDetails]);

  const navigateToPriorAuthDetails = (referenceId: string) => {
    console.log(
      'Navigating to Prior Auth Details with referenceId:',
      referenceId,
    );
    setSelectedPriorAuth(
      priorAuthList.find((auth) => auth.referenceId === referenceId) ?? null,
    );
    router.push('/priorAuthorization/authDetails');
  };

  function priorAuthErrorMessage() {
    return (
      <Column className="neutral container">
        <Column className="items-center  p-4 m-[65px]">
          <Spacer axis="horizontal" size={8} />
          <TextBox
            className="text-center"
            text="There was a problem loading prior auth details"
          />
        </Column>
      </Column>
    );
  }
  return (
    <Column className="mt-2">
      <div className={'xs:block md:inline-flex max-sm:m-4 md:my-2 relative'}>
        <Row className="body-1 flex-grow align-top mb-0 ">
          Filter Results:{' '}
          <TextBox
            type="body-1"
            className="font-bold ml-2"
            text={`${priorAuthDetails?.length ?? 0} Prior Authorizations`}
          />
        </Row>
        <Row className="body-1 items-end">
          <div className="body-1 mb-1">Sort by:</div>
          <div>
            <RichDropDown
              minWidth="min-w-[200px]"
              headBuilder={(val) => (
                <a className="link ml-2 flex" aria-labelledby="sort-label">
                  {val.label}{' '}
                  <Image
                    src={downIcon}
                    className="w-[20px] h-[20px] ml-2"
                    alt=""
                    aria-hidden="true"
                  />
                </a>
              )}
              itemData={sortBy}
              itemsBuilder={(data) => (
                <p className="text-nowrap">{data.label}</p>
              )}
              selected={selectedSort}
              onSelectItem={(val) => {
                setSelectedSort(val);
              }}
              aria-label="Sort claims by"
            />
          </div>
        </Row>
        <Spacer axis="horizontal" size={8} />
      </div>

      <div className={'flex flex-col max-sm:my-4'}>
        <Spacer size={16} />
        {priorAuthDetails == null && priorAuthErrorMessage()}
        {priorAuthList && (
          <Pagination<MemberPriorAuthDetail>
            key={selectedSort.label} // Ensure key changes when sort changes
            initialList={priorAuthList}
            pageSize={5}
            wrapperBuilder={(items) => <Column>{items}</Column>}
            itemsBuilder={(item, index) => (
              <PriorAuthItem
                key={`${item.referenceId}-${index}`} // Combine referenceId with index for uniqueness
                className="mb-4"
                priorAuthDetails={mapToPriorAuthDetails(item)}
                callBack={navigateToPriorAuthDetails}
              />
            )}
            label="Prior Authorizations"
            totalCount={priorAuthList.length}
          />
        )}
      </div>
    </Column>
  );
};
