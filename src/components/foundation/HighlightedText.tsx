import { TextBox } from './TextBox';

type HighlightedTextProps = {
  text: string;
  searchTerm: string;
  className?: string;
  highlightedTextClassName?: string;
};

export const HighlightedText = ({
  text,
  searchTerm,
  className,
  highlightedTextClassName = '',
}: HighlightedTextProps) => {
  if (searchTerm.length < 2) {
    return <TextBox className={className} text={text} />;
  }

  const regex = new RegExp(searchTerm, 'gi');
  const parts = text.split(regex);

  const highlightedParts = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    highlightedParts.push(<span>{parts.shift()}</span>);
    const remaining = match.slice(searchTerm.length);
    highlightedParts.push(
      <span key={highlightedParts.length}>
        <span className={`font-bold ${highlightedTextClassName}`}>
          {match.slice(0, searchTerm.length)}
        </span>
        {remaining}
      </span>,
    );
  }
  highlightedParts.push(parts.shift());

  return <p className={className}>{highlightedParts}</p>;
};
