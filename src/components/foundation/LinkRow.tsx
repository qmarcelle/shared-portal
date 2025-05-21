import Image from 'next/image';
import Link from 'next/link';
import rightIcon from '../../../public/assets/right.svg';

export interface LinkRowProps {
  label: string;
  description?: JSX.Element;
  icon?: JSX.Element;
  divider?: boolean;
  onClick?: () => void | Promise<void>;
  link?: string;
}

export const LinkRow = ({
  label,
  description,
  icon = <Image src={rightIcon} alt="" />,
  divider = false,
  onClick,
  link,
}: LinkRowProps) => {
  const content = (
    <>
      <div className="flex flex-row m-2">
        <p className="link-row-head mr-2" tabIndex={0}>
          {label}
        </p>
        {icon}
      </div>
      {description && <div className="m-2">{description}</div>}
    </>
  );

  return link ? (
    <Link
      className={`flex flex-col p-1 ${divider && 'link-row'} cursor-pointer link-row-container`}
      href={link}
    >
      {content}
    </Link>
  ) : (
    <div
      onClick={onClick}
      className={`flex flex-col p-1 ${divider && 'link-row'} cursor-pointer link-row-container`}
    >
      {content}
    </div>
  );
};
