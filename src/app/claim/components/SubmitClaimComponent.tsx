import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { logger } from '@/utils/logger';
import axios from 'axios';

function download() {
  axios
    .get('testPDF.pdf', { responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'testPDF.pdf');
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      logger.error(err);
    });
}

export const SubmitClaimComponent = ({ className }: IComponent) => {
  return (
    <Card className={className}>
      <Button
        className="font-bold active"
        label="Download PDF"
        type="primary"
        callback={download}
      ></Button>
    </Card>
  );
};
