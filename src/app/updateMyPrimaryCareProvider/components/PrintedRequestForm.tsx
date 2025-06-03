import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { downloadIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { logger } from '@/utils/logger';
import axios from 'axios';
import Image from 'next/image';

interface PrintedRequestFormProps extends IComponent {
  icon?: JSX.Element;
}

export const PrintedRequestForm = ({
  icon = <Image src={downloadIcon} alt="" />,
}: PrintedRequestFormProps) => {
  function downloadPDF() {
    axios
      .get('/assets/primary_care_provider_pcp_change_request_form.pdf', {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          '/assets/primary_care_provider_pcp_change_request_form.pdf',
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        logger.error(err);
      });
  }
  return (
    <Card className="m-4 p-8">
      <Column>
        <Header
          className="title-2"
          text="Option 3: Complete & Mail a Printed Request Form"
        />
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="You can download, fill out and complete a print form in order to request to add or update your primary care provider. If there are any issues with your request, we'll contact you."
        />
        <Spacer size={32} />
        <AppLink
          label="Primary Care Provider Change Form"
          icon={icon}
          className="!flex pl-0"
          callback={downloadPDF}
        />
      </Column>
    </Card>
  );
};
