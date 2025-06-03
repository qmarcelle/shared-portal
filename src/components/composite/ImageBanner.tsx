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
        {imageSrc ? <Image className="size-10" src={imageSrc} alt="" /> : image}
      </section>
    </Card>
  );
};
