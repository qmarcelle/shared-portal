import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { accessGranted } from '@/components/foundation/Icons';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Image from 'next/image';

const renderUI = () => {
  return render(
    <AccordionListCard
      header="Understanding Access On My Plan"
      information={[
        {
          icon: (
            <Image
              className="size-[20px] mt-1"
              src={accessGranted}
              alt="success"
            />
          ),
          title: 'Access Granted',
          body: (
            <div className="m-1">
              Indicates that you can access other members information on your
              plan. You will be able see their information on your account. On
              pages such as claims, documents, prior authorizations and more,
              youll be able to filter for members on your plan that have granted
              you access to their information.
            </div>
          ),
        },
        {
          title: 'Request Access',
          body: (
            <div className="m-1">
              You can request access to other members&apos;s; information on
              your plan.
            </div>
          ),
        },
        {
          title: 'Special Permissions',
          body: (
            <div className="m-1">
              In some cases, you may need to become a personal representative of
              an individual before gaining access to their information. A
              personal representative is an individual with the legal authority
              to make decisions for others, such as a minor dependent. You can
              learn more about personal representive status here.
            </div>
          ),
        },
      ]}
    ></AccordionListCard>,
  );
};

describe('UnderstandingAccessOnMyPlan', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', { name: 'Understanding Access On My Plan' });
    screen.getByText('Access Granted');
    let accessGranted = screen.queryByText(
      'Indicates that you can access other members information on your plan. You will be able see their information on your account. On pages such as claims, documents, prior authorizations and more, youll be able to filter for members on your plan that have granted you access to their information.',
    );
    expect(accessGranted).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Access Granted')); //check that body text is visible after clicking
    accessGranted = screen.getByText(
      'Indicates that you can access other members information on your plan. You will be able see their information on your account. On pages such as claims, documents, prior authorizations and more, youll be able to filter for members on your plan that have granted you access to their information.',
    );
    expect(accessGranted).toBeInTheDocument();

    fireEvent.click(screen.getByText('Access Granted')); //check that it is not visible after clicking again
    accessGranted = screen.queryByText(
      'Indicates that you can access other members information on your plan. You will be able see their information on your account. On pages such as claims, documents, prior authorizations and more, youll be able to filter for members on your plan that have granted you access to their information.',
    );
    expect(accessGranted).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
