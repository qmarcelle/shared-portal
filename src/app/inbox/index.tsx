'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { DocumentCenter } from './components/documentCenter/DocumentCenter';
import { IDocumentMetadata, IMemberInfo } from './models/api/document';

interface InboxProps {
  documents: IDocumentMetadata[];
  membersInfo: IMemberInfo[];
}

const Inbox = ({ documents, membersInfo }: InboxProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Inbox"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <DocumentCenter documents={documents} membersInfo={membersInfo} />
      </Column>
    </main>
  );
};

export default Inbox;
