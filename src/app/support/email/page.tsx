import SendAnEmail from '.';
import { getEmailData } from './actions/getEmailData';
const SendAnEmailPage = async () => {
  const result = await getEmailData();
  return <SendAnEmail data={result.data!} />;
};

export default SendAnEmailPage;
