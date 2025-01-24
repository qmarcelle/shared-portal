import { Metadata } from 'next';
import UpdateMyPrimaryCareProvider from '.';
import { getInitialMemberListFilter } from './actions/getInitialMemberListFilter';

export const metadata: Metadata = {
  title: 'UpdateMyPrimaryCareProvider',
};

const UpdateMyPrimaryCareProviderPage = async () => {
  const filterItems = await getInitialMemberListFilter();

  return <UpdateMyPrimaryCareProvider filters={filterItems.data ?? []} />;
};

export default UpdateMyPrimaryCareProviderPage;
