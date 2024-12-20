'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { useState } from 'react';
import { DocumentCenter } from './components/documentCenter/DocumentCenter';
import { Notification } from './components/notification/Notification';
import { IDocumentMetadata, IMemberInfo } from './models/api/document';

interface InboxProps {
  documents: IDocumentMetadata[];
  membersInfo: IMemberInfo[];
}

const Inbox = ({ documents, membersInfo }: InboxProps) => {
  const [showDocuments, setShowDocuments] = useState(true);

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          text="Inbox"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />

        <section className="m-4 mb-0">
          <div className="flex">
            <div
              className={`mr-4 title-3 font-bold toggle-link ${showDocuments && 'text-[--primary-color] toggle-link-active'}`}
            >
              <a onClick={() => setShowDocuments(true)}>Document Center</a>
            </div>
            <div
              className={`font-bold title-3 toggle-link ${!showDocuments && 'text-[--primary-color] toggle-link-active'}`}
            >
              <a onClick={() => setShowDocuments(false)}>Notifications</a>
            </div>
          </div>
          <hr />
        </section>
        {showDocuments ? (
          <DocumentCenter documents={documents} membersInfo={membersInfo} />
        ) : (
          <Notification />
        )}
      </Column>
    </main>
  );
};

export default Inbox;
