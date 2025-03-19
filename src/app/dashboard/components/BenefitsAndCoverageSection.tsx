import { BenefitDetails } from '@/app/dashboard/models/benefits_detail';
import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Divider } from '@/components/foundation/Divider';
import { rightIcon } from '@/components/foundation/Icons';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import { useState } from 'react';

interface BenefitsAndCoverageSectionProps extends IComponent {
  benefits: BenefitDetails[];
}

export const BenefitsAndCoverageSection = ({
  benefits,
  className,
}: BenefitsAndCoverageSectionProps) => {
  const [, setSearchItem] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(benefits);

  const handleSearch = (searchTerm: string) => {
    const searchTerm1 = searchTerm;
    setSearchItem(searchTerm1);

    const filteredItems = benefits.filter((benefit) =>
      benefit.benefitName.toLowerCase().includes(searchTerm1.toLowerCase()),
    );

    console.log('Searching for:', filteredItems);
    setFilteredUsers(filteredItems);
  };

  return (
    <Card className={className}>
      <div>
        <h3 className="title-2">Benefits & Coverage</h3>
        <Spacer size={32} />
        <SearchField onSearch={handleSearch} hint="Search Benefits" />
        <Spacer size={32} />
        <div className="flex">
          <label className="body-1">Browse your benefits by category:</label>
          <Spacer size={32} />
        </div>
        {filteredUsers.slice(0, filteredUsers.length).map((item) => (
          <div key={item.benefitName}>
            <Spacer size={16} />
            <a
              href={item.benefitURL}
              className="flex flex-row w-fit"
              key={item.benefitName}
            >
              <div className="flex flex-col">
                <button
                  className="body-bold"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {item.benefitName}
                </button>
                <Spacer axis="horizontal" size={8} />
              </div>
              <div className="flex flex-col ">
                <Image src={rightIcon} className="icon mt-2" alt="" />
              </div>
            </a>
            <Spacer size={16} />
            <Divider />
          </div>
        ))}
        <Spacer size={32} />
        <AppLink label="View Benefits & Coverage" />
      </div>
    </Card>
  );
};
