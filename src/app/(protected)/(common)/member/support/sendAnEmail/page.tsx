/**
 * support/sendAnEmail
 * Send an email
 */
export const metadata = {
  title: 'Send an email | Consumer Portal',
  description: 'Send an email'
};

import SendAnEmail from '.';
import { getEmailData } from './actions/getEmailData';
const SendAnEmailPage = async () => {
  const result = await getEmailData();
  return <SendAnEmail data={result.data!} />;
};

export default SendAnEmailPage;
