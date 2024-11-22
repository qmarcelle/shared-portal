import Image from 'next/image';
import AlertIcon from '../../../public/assets/alert_gray.svg';
import { Column } from '../foundation/Column';
import { Row } from '../foundation/Row';
import { TextBox } from '../foundation/TextBox';

export type AccessCodeProps = {
  accessCodeData: string;
};
export const AccessCode = ({ accessCodeData }: AccessCodeProps) => {
  return (
    <Column>
      {accessCodeData && (
        <div className="access-code ">
          <TextBox text="Access Code" className="ml-6 mt-3 text-[10px]" />

          <TextBox
            text={accessCodeData}
            className="ml-3  font-bold text-[15px]"
          />
        </div>
      )}
      {!accessCodeData && (
        <Row className="card-neutral h-[44px]">
          <Image
            src={AlertIcon}
            className="h-[19px] w-[19px] mt-3 ml-3"
            alt="alert"
          />
          <TextBox text="Access code could not load." className="mt-3 ml-2" />
        </Row>
      )}
    </Column>
  );
};
