import { Metadata } from 'next';
import RequestForm from '.';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FormRequestCard',
};

const RequestFormPage = async () => {
  return <RequestForm />;
};

export default RequestFormPage;
