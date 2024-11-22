import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';

interface BenefitsDropdownsProps {
  className?: string;
  filterHeading: string;
}

export const BenefitsDropdowns = ({
  className,
  filterHeading,
}: BenefitsDropdownsProps) => {
  return (
    <Card className="small-section">
      <>
        <Header className="title-2" text="Filter Benefits" />
        <Spacer size={32} />
        <div className="body-1">Member</div>
        <RichDropDown<FilterDetails>
          headBuilder={(val) => <FilterHead user={val} />}
          itemData={getMemberDropdownValues(memberInfo) as FilterDetails[]}
          itemsBuilder={(data, index) => <FilterTile user={data} key={index} />}
          selected={getMemberDropdownValues(memberInfo)[0] as FilterDetails}
          onSelectItem={(val) => {
            onMemberSelectionChange(val.value);
          }}
        />
        <Spacer size={16} />
        <div className="body-1">Benefit Type</div>
        <RichDropDown<FilterDetails>
          headBuilder={(val) => <FilterHead user={val} />}
          itemData={
            getBenefitTypes(
              currentSelectedMember.planDetails,
            ) as FilterDetails[]
          }
          itemsBuilder={(data, index) => <FilterTile user={data} key={index} />}
          selected={
            getBenefitTypes(
              currentSelectedMember.planDetails,
            )[0] as FilterDetails
          }
          onSelectItem={(val) => {
            onBenefitTypeSelectChange(val.value);
          }}
        />
      </>
    </Card>
  );
};
