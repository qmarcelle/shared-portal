import '@/styles/breadcrumb.css';
import Image from 'next/image';
import Link from 'next/link';
import { rightWhiteIcon } from '../foundation/Icons';
import { IComponent } from '../IComponent';
export interface BreadcrumbItem {
  path: string;
  label: string;
}

export interface BreadcrumbProps extends IComponent {
  items: BreadcrumbItem[];
}

export const BreadCrumb = ({ items }: BreadcrumbProps) => {
  const current = items.length - 2;

  function computePathLink(index: number) {
    return items
      .slice(0, index - (items.length-1))
      .map((item) => item.path)
      .join("");
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="breadcrumb items-center body-2 ">
        <>
          {items.map((item, index) => (
            <li key={index} className="hidden md:flex items-center ml-0">
              {index === items.length - 1 ? (
                <span aria-current="page" className="breadcrumb-current">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    className="text-primary font-bold"
                    href={computePathLink(index)}
                  >
                    {item.label}
                  </Link>
                  <div className="px-2">
                    <Image
                      src={rightWhiteIcon}
                      alt=""
                      className="mx-1 h-4 w-4"
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </>
      </ol>
    </nav>
  );
};

