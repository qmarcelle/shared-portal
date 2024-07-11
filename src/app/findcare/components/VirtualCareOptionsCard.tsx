import { VirtualCareOptionsInfo } from '@/app/findcare/models/VirtualCareOptionsInfo';
import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';

interface VirtualCareOptionsCardProps
  extends IComponent,
    VirtualCareOptionsInfo {}

export const VirtualCareOptionsCard = ({
  title,
  description,
  url,
  className,
}: VirtualCareOptionsCardProps) => {
  return (
    <Card className={`cursor-pointer ${className}`} type="elevated">
      <a className="p-4 block" href={url}>
        <Title className="font-bold primary-color" text={title} />
        <Spacer size={16} />
        <TextBox text={description} />
      </a>
    </Card>
  );
};
