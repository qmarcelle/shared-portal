import { PriorAuthDetails } from "@/app/dashboard/models/priorAuth_details"
import { IComponent } from "../../../components/IComponent"
import { AppLink } from "../../../components/foundation/AppLink"
import { Card } from "../../../components/foundation/Card"
import { Spacer } from "../../../components/foundation/Spacer"
import { Button } from "../../../components/foundation/Button"
import { Row } from "../../../components/foundation/Row"
import { TextBox } from "../../../components/foundation/TextBox"
import { ReactElement, ReactNode } from "react"
import Image from "next/image"
import { externalOffsiteWhiteIcon } from "../../../components/foundation/Icons"

interface PayPremiumProps extends IComponent {
    dueDate:string,
    amountDue: number,
    icon?:ReactNode
}


export const PayPremiumSection = ({ dueDate, amountDue, className, icon=<Image alt="external icon" src={externalOffsiteWhiteIcon} />}: PayPremiumProps) => {

    return<Card className={className} >
        <div>
            <h2 className="title-2" >Pay Premium</h2>
            <Spacer size={32} />
            <Row>
                <TextBox text="Payment Due Date"/>
                <Spacer axis="horizontal" size={40} />
                <p className="font-bold">{dueDate}</p>
            </Row>
            <Spacer size={12} />
            <Row>
                <TextBox text="Amount Due"/>
                <Spacer axis="horizontal" size={80} />
                <p className="font-bold">${amountDue}</p>
            </Row>
            <Spacer size={32} />
            <Button icon ={icon} label="View or Pay Premium" callback={()=>null}/>
        </div>
        </Card>
}