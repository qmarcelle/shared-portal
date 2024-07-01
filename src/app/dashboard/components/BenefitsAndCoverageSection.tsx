import Input from "postcss/lib/input"
import { IComponent } from "../../../components/IComponent"
import { AppLink } from "../../../components/foundation/AppLink"
import { Card } from "../../../components/foundation/Card"
import { Dropdown } from "../../../components/foundation/Dropdown"
import { Spacer } from "../../../components/foundation/Spacer"
import { TextField } from "../../../components/foundation/TextField"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState } from "react"
import { BenefitDetails } from "@/app/dashboard/models/benefits_detail"
import { Divider } from "../../../components/foundation/Divider"
import MedicalIcon from '../../../../public/assets/Medical.svg'
import RightIcon from '../../../../public/assets/right.svg'
import Image from "next/image"
import SearchField from "../../../components/foundation/SearchField"
import SearchIcon from "../../../../public/assets/Search.svg"

interface BenefitsAndCoverageSectionProps extends IComponent {
   benefits:BenefitDetails[]
}

export const BenefitsAndCoverageSection = ({ benefits, className }: BenefitsAndCoverageSectionProps) => {


    const [searchItem, setSearchItem] = useState('')
    const [filteredUsers, setFilteredUsers] = useState(benefits);

    const handleSearch = (searchTerm: any) => {
        const searchTerm1 = searchTerm;
        setSearchItem(searchTerm1)

        const filteredItems = benefits.filter((benefit) =>
            benefit.benefitName.toLowerCase().includes(searchTerm1.toLowerCase())
        );

        console.log("Searching for:", filteredItems);
        setFilteredUsers(filteredItems);
    };



    return <Card className={className}>
        <div>
            <h2 className="title-2" >Benefits & Coverage</h2>
            <Spacer size={32} />      
                <SearchField  onSearch={handleSearch} hint="Search Benefits"/>             
            <Spacer size={32} />
            <div className="flex">
                <label className="body-1">Browse your benefits by category:</label>
                <Spacer size={32}/>
            </div>
            {
                filteredUsers.slice(0, filteredUsers.length)
                    .map(item => <>
                        <Spacer size={16} />
                            <a href={item.benefitURL} className="flex flex-row" key={item.benefitName}>
                                <div className="flex flex-col flex-grow">
                                    <button className="font-bold" style={{ color: 'var(--primary-color)' }}>{item.benefitName}</button>
                                    <Spacer axis="horizontal" size={8} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <Image src={RightIcon} className='icon items-end' alt="Next" />
                                </div>
                            </a>
                        <Spacer size={16} />
                        <Divider />
                    </>)
            }
             <Spacer size={32} />
            <AppLink label="View All Benefits & Coverage" />

        </div>
    </Card>
}