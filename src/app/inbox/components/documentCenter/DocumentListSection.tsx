import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { base64ToBlob } from '@/utils/base64_blob_converter';
import download from 'downloadjs';
import { DocumentCard, DocumentCardProps } from './DocumentCard';

interface DocumentSectionProps extends IComponent {
  documentCards: DocumentCardProps[];
}

export const DocumentListSection = ({
  className,
  documentCards,
}: DocumentSectionProps) => {
  const downloadDocument = async (data: string | undefined) => {
    const pdfBlob = base64ToBlob(data!, 'application/pdf');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    // Open the ID Card PDF in a new tab.
    window.open(pdfUrl);
    // Download the ID Card pdf
    download(pdfBlob, 'Member Document', 'application/pdf');
  };

  return (
    <>
      <Column className={`space-y-4 ${className}`}>
        <div className="flex justify-between">
          <p>
            Filter Results: <b>{documentCards.length} Documents</b>
          </p>
          {/* <p>Sort By</p> */}
        </div>

        {documentCards.map((data, index) => (
          <DocumentCard
            key={index}
            title={data.title}
            received={data.received}
            for={data.for}
            onClick={() => {
              downloadDocument(data.link);
            }}
          />
        ))}
      </Column>
    </>
  );
};
