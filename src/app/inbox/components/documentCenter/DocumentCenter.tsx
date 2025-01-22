import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
// import { FilterDetails } from '@/models/filter_dropdown_details';
import { useEffect, useState } from 'react';

import { FilterDetails } from '@/models/filter_dropdown_details';
import { getDocumentFileInfo } from '../../actions/documents';
import {
  IDocumentMetadata,
  IMemberInfo,
  ITaskInfo,
} from '../../models/api/document';
import { DocumentCardProps } from './DocumentCard';
import { DocumentListSection } from './DocumentListSection';

interface DocumentProps {
  documents: IDocumentMetadata[];
  membersInfo: IMemberInfo[];
}

export const DocumentCenter = ({ documents, membersInfo }: DocumentProps) => {
  const defaultMemberFilterValue: FilterDetails = {
    label: 'All Members',
    value: '1',
    id: '1',
  };

  const defaultDocumentTypeFilterValue: FilterDetails = {
    label: 'All Types',
    value: '1',
    id: '1',
  };
  const [documentCards, setDocumentCards] = useState<DocumentCardProps[]>([]);
  const [documentLink, setDocumentLink] = useState('');
  const [membersList, setMembersList] = useState<IMemberInfo[]>(membersInfo);
  const [documentsList, setDocumentsList] =
    useState<IDocumentMetadata[]>(documents);
  const [memberFilterSelectedValue, setMemberFilterSelectedValue] =
    useState<FilterDetails>(defaultMemberFilterValue);
  const [documentTypeFilterSelectedValue, setDocumentTypeFilterSelectedValue] =
    useState<FilterDetails>(defaultDocumentTypeFilterValue);
  useEffect(() => {
    if (documentsList && membersList && documentsList.length > 0) {
      setDocumentCards(
        documentsList
          .filter((doc: IDocumentMetadata) =>
            membersList?.some((member) => member.id === doc.memberId),
          )
          .map((document: IDocumentMetadata) => {
            const firstTask: ITaskInfo = document.taskInfo[0];
            const nameOnDoc: string =
              membersList?.find(
                (mInfo: IMemberInfo) => mInfo.id === document.memberId,
              )?.name ?? 'No name found';
            getDocumentLink(
              document.documentIdentifier,
              firstTask.taskSequenceNumber.toString(),
            );
            return {
              title:
                firstTask.communicationInfo[0]?.documentTitle ||
                'Unknown Title',
              received: `Received: ${firstTask.fromDate}`,
              for: `For: ${nameOnDoc}`,
              readIndicator: false,
              link: documentLink,
            };
          }),
      );
    }
  }, [documentLink, documents, membersInfo, membersList, documentsList]);

  const getDocumentLink = async (id: string, sequenceNumber: string) => {
    const documentFileInfo = await getDocumentFileInfo(id, sequenceNumber);

    setDocumentLink(documentFileInfo.data!.fileContents);
  };
  const membersFilterValue: string | FilterDetails[] | undefined =
    membersInfo && membersInfo.length
      ? [
          defaultMemberFilterValue,
          ...membersInfo?.map((member: IMemberInfo) => {
            return {
              label: member.name,
              value: member.id,
              id: member.id,
            };
          }),
        ]
      : [defaultMemberFilterValue];

  return (
    <section className="flex flex-row items-start app-body" id="Filter">
      <Column className=" flex-grow page-section-36_67 items-stretch">
        <Filter
          className="large-section px-0 m-0"
          filterHeading="Filter Documents"
          onReset={() => {}}
          showReset={false}
          onSelectCallback={(selected: number, data) => {
            switch (true) {
              case selected === 0:
                const memberInfo: IMemberInfo = {
                  name: data[selected].selectedValue!.label,
                  id: data[selected].selectedValue!.id,
                };
                data[selected].selectedValue === defaultMemberFilterValue
                  ? setMembersList(membersInfo)
                  : setMembersList([memberInfo]);
                setMemberFilterSelectedValue(data[selected].selectedValue!);
                break;
              case selected === 1:
                /// add logic to update documentsList
                setDocumentsList(documentsList);
                setDocumentTypeFilterSelectedValue(
                  data[selected].selectedValue!,
                );
                break;
            }
            if (selected === 0) {
              const memberInfo: IMemberInfo = {
                name: data[selected].selectedValue!.label,
                id: data[selected].selectedValue!.id,
              };
              data[selected].selectedValue === defaultMemberFilterValue
                ? setMembersList(membersInfo)
                : setMembersList([memberInfo]);
              setMemberFilterSelectedValue(data[selected].selectedValue!);
            }
          }}
          filterItems={[
            {
              type: 'dropdown',
              label: 'Member',
              value: membersFilterValue,
              selectedValue: memberFilterSelectedValue,
            },
            {
              type: 'dropdown',
              label: 'Document Type',
              value: [
                {
                  label: 'All Types',
                  value: 'all',
                  id: '1',
                },
                {
                  label: 'PDF',
                  value: 'pdf',
                  id: '2',
                },
              ],
              selectedValue: documentTypeFilterSelectedValue,
            },
            {
              type: 'dropdown',
              label: 'Date Range',
              value: [
                {
                  label: 'Last 30 days',
                  value: '30',
                  id: '1',
                },
                {
                  label: 'Last 60 days',
                  value: '60',
                  id: '2',
                },
                {
                  label: 'Last 90 days',
                  value: '90',
                  id: '3',
                },
                {
                  label: 'Current Year',
                  value: '365',
                  id: '4',
                },
                {
                  label: 'Last Two Years',
                  value: '730',
                  id: '5',
                },
              ],
              selectedValue: {
                label: 'Last Two Years',
                value: '730',
                id: '5',
              },
            },
          ]}
        />
      </Column>
      <Column className="flex-grow page-section-63_33 items-stretch mt-4">
        <DocumentListSection documentCards={documentCards} />
      </Column>
    </section>
  );
};
