import { BenefitsProviderInfo } from "@/app/dashboard/models/BenefitsProviderInfo"
import { Card } from "../../../components/foundation/Card"
import { IComponent } from "../../../components/IComponent"
import { BenefitsProviderInfoCard } from "./BenefitsProviderInfoCard"
import { Spacer } from "../../../components/foundation/Spacer"
import { AppLink } from "../../../components/foundation/AppLink"
import { SlidingCarousel } from "../../../components/foundation/SlidingCarousel"
import { Column } from "../../../components/foundation/Column"
import { TextBox } from "../../../components/foundation/TextBox"
import { Header } from "../../../components/foundation/Header"

interface EmployeeProvidedBenefitsProps extends IComponent {
    employer: string
    benefits: BenefitsProviderInfo[]
}

export const EmployeeProvidedBenefitsTile = ({ employer, benefits, className }: EmployeeProvidedBenefitsProps) => {

    return <Card className={className} >
        <Column >
            <Header type="title-2" text={`Provided By ${employer}`} />
            <Spacer size={16} />
            <TextBox text="Your employer offers even more programs and benefits you can explore here" />
            <Spacer size={32} />
            <SlidingCarousel>
                {benefits.map(item => <BenefitsProviderInfoCard key={item.id} id={item.id} className="mr-4 shrink-0"
                    contact={item.contact} providedBy={item.providedBy} url={item.url} />)}
            </SlidingCarousel>
            <Spacer size={32} />
            <AppLink label="View All Employer Provided Benefits" />
        </Column>
    </Card>
}