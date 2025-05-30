import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import SendAnEmail from '.';
import { getEmailData } from './actions/getEmailData';
const SendAnEmailPage = async () => {
  const contact = await invokePhoneNumberAction();
  const result = await getEmailData();
  return <SendAnEmail data={result.data!} contact={contact} />;
};

export default SendAnEmailPage;
