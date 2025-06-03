import { Metadata } from 'next';
import Inbox from '.';

import { getDocumentsList } from './actions/documents';
import { getMembersInfoList } from './utils/memberInfo';

export const metadata: Metadata = {
  title: 'Inbox',
};

const InboxPage = async () => {
  const [membersInfo, documents] = await Promise.all([
    getMembersInfoList(),
    getDocumentsList(),
  ]);

  return (
    <Inbox
      membersInfo={membersInfo.data!}
      documents={documents.documentMetadataList!}
    />
  );
};

export default InboxPage;
