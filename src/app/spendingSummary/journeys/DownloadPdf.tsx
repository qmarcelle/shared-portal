import { InitModalSlide } from '@/components/composite/InitModalSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { logger } from '@/utils/logger';
import axios from 'axios';
import { SetStateAction, useState } from 'react';

export const DownloadPdf = ({ pageIndex }: ModalChildProps) => {
  const [selectedData, setSelectedData] = useState('2023');

  function handleClick(event: SetStateAction<string>) {
    setSelectedData(event);
  }

  function downloadPdf() {
    axios
      .get('testPDF.pdf', { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('downloadPdf', 'testPDF.pdf');
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  const { dismissModal } = useAppModalStore();

  const pages = [
    <InitModalSlide
      key="first"
      label="Download Spending Summary Statement"
      subLabel={
        <Column>
          <TextBox
            className="text-center"
            text="Select which year you would like to download"
          />
          <Spacer size={24} />
          <Column className="download-pdf">
            <Radio
              label="2023"
              value="2023"
              selected={selectedData === '2023'}
              callback={handleClick}
            />
            <Spacer size={16} />
            <Radio
              label="2022"
              value="2022"
              selected={selectedData === '2022'}
              callback={handleClick}
            />
            <Spacer size={16} />
            <Radio
              label="2021"
              value="2021"
              selected={selectedData === '2021'}
              callback={handleClick}
            />
          </Column>
        </Column>
      }
      changeAuthButton={undefined}
      buttonLabel="Download Statement"
      nextCallback={downloadPdf}
      cancelCallback={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
