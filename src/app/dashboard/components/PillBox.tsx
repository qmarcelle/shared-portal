import { IComponent } from "../../../components/IComponent"
import { Card } from "../../../components/foundation/Card"
import { Spacer } from "../../../components/foundation/Spacer"
import { Button } from "../../../components/foundation/Button"
import { Row } from "../../../components/foundation/Row"

import { Header } from "../../../components/foundation/Header"


interface PillBoxProps extends IComponent {
    title: string
    icon?: JSX.Element
    pillObjects: PillData[]
}

export interface PillData {
    label: string 
    callback?: () => void | Promise<void> | null
}

export const PillBox = ({title, pillObjects, icon}: PillBoxProps) => {
    return <Card className = "large-section">
            <section className="gap-8">
                <Row className="align-top items-center">
                    {icon}
                    <Spacer axis="horizontal" size={16} />
                    <Header text={title} type="title-3" className="!font-bold"/>
                </Row>
                <Spacer size = {16}/>
                <Row className = "flex-wrap gap-x-2 gap-y-4">
                    {pillObjects.map((pillData, index) => <Button key = {index} type = "pill" label = {pillData.label} callback = {pillData.callback}/>
                    )}
                </Row>
            </section>
    </Card>
}
