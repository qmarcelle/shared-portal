/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import { useRef } from 'react';
import Slider from 'react-slick';
import AlertIcon from '../../../../public/assets/alert_gray.svg';
import leftIcon from '../../../../public/assets/left_large.svg';
import rightIcon from '../../../../public/assets/right_large.svg';

const PreviousArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <>
      <div className={className} onClick={onClick}>
        <Image className="icon-sm" src={leftIcon} alt="scroll left" />
      </div>
    </>
  );
};

const NextArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <>
      <>
        <div className={className} onClick={onClick}>
          <Image
            className="icon-sm ml-20px"
            src={rightIcon}
            alt="scroll left"
          />
        </div>
      </>
    </>
  );
};

export type ImageSliderProps = {
  svgFrontData: string | null;
  svgBackData: string | null;
} & IComponent;

export const ImageSlider = ({
  svgFrontData,
  svgBackData,
}: ImageSliderProps) => {
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />,
    beforeChange: (current: any, next: any) => {
      sliderRef.current.slickGoTo(next);
    },
  };

  function iDCardFront() {
    return (
      <Column>
        {svgFrontData == null && idCardErrorMessage()}
        {svgFrontData && (
          <Image
            src={`data:image/svg+xml;charset=utf8,${encodeURIComponent(svgFrontData)}`}
            alt="FrontCard"
            fill={true}
            className="!relative m-auto"
          />
        )}
      </Column>
    );
  }

  function iDCardBack() {
    return (
      <Column>
        {svgBackData == null && idCardErrorMessage()}
        {svgBackData && (
          <Image
            src={`data:image/svg+xml;charset=utf8,${encodeURIComponent(svgBackData)}`}
            alt="BackCard"
            fill={true}
            className="!relative m-auto"
          />
        )}
      </Column>
    );
  }

  function idCardErrorMessage() {
    return (
      <Column className="neutral container">
        <Column className="items-center  p-4 m-[65px]">
          <Image src={AlertIcon} className="icon" alt="alert" />
          <Spacer axis="horizontal" size={8} />
          <TextBox
            className="text-center"
            text="There was a problem loading your ID Card. Try refreshing the page or returning to this page later."
          />
        </Column>
      </Column>
    );
  }

  return (
    <Column
      className={
        'w-[250px] md:w-[450px] lg:w-[420px] justify-center ml-[30px] mt-10 mb-10 '
      }
    >
      <Slider ref={sliderRef} {...settings}>
        <Column className="slider-container carousel flex flex-col">
          {iDCardFront()}
        </Column>
        <Column>{iDCardBack()}</Column>
      </Slider>
    </Column>
  );
};
