/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useRef } from 'react';
import Slider from 'react-slick';
import rightIcon from '../../../../public//assets/right_large.svg';
import AlertIcon from '../../../../public/assets/Alert-Gray1.svg';
import IDCardBackCard from '../../../../public/assets/idcard_back.svg';
import IDCardFrontCard from '../../../../public/assets/IDCardFrontCard.svg';
import leftIcon from '../../../../public/assets/left_large.svg';

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

export const ImageSlider = () => {
  const sliderRef = useRef<any>(null);
  const isErrorslide = false;

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

  return (
    <Column
      className={`w-[250px] md:w-[450px] lg:w-[420px] justify-center ml-[30px] mt-10 mb-10 ${isErrorslide ? 'neutral container' : ''}`}
    >
      <Slider ref={sliderRef} {...settings}>
        <Column className="slider-container carousel flex flex-col">
          <Image src={IDCardFrontCard} className="m-auto" alt="FrontCard" />
        </Column>
        <Column>
          <Image src={IDCardBackCard} className="m-auto" alt="BackCard" />
        </Column>
        {isErrorslide && (
          <Column className="items-center  p-4 mt-[65px]">
            <Image src={AlertIcon} className="icon" alt="alert" />
            <Spacer axis="horizontal" size={8} />
            <TextBox
              className="text-center"
              text="There was a problem loading your ID Card. Try refreshing the page or returning to this page later."
            />
          </Column>
        )}
      </Slider>
    </Column>
  );
};
