import Image from 'next/image';
import { Card } from '../foundation/Card';
import { IComponent } from '../IComponent';

interface ImageBannerProps extends IComponent {
  body: JSX.Element;
  image?: JSX.Element;
  imageSrc?: string;
  alt?: string;
}

export const ImageBanner = ({
  body,
  image,
  imageSrc,
  alt,
  className,
}: ImageBannerProps) => {
  return (
    <Card type="elevated" className={className}>
      <section className="sm:flex sm:flex-row">
        {body}
        {imageSrc ? (
          <Image
            className="size-10"
            src={imageSrc}
            alt={alt ?? 'image'}
            fill
            style={{ width: 'auto', height: 'auto' }}
          />
        ) : (
          image
        )}
      </section>
    </Card>
  );
};
