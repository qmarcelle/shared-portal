import Breadcrumbs, {
  BreadcrumbsProps,
} from '@/components/composite/Breadcrumbs';
//import {BreadCrumb} from './components/composite/BreadCrumb'
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const breadcrumbs: BreadcrumbsProps[] = [
  { path: '/member/mypla', templateText: 'My Plan' },
  { path: '/claims', templateText: 'Claims' },
];

const renderUI = () => {
  return render(
    <Breadcrumbs path={breadcrumbs.map((b) => b.path).join(' > ')} />,
  );
};

describe('BreadCrumb', () => {
  test('render breadcrumb items correctly', () => {
    const { container } = renderUI();

    //check if all the breadcrumbs item are rendered
    expect(screen.getByText('My Plan')).toBeInTheDocument();
    expect(screen.getByText('Claims')).toBeInTheDocument();

    //check if link exists for the correct items
    expect(screen.getByText('My Plan').closest('a')).toHaveAttribute(
      'href',
      '/member/myplan',
    );
    expect(screen.getByText('Claims').closest('a')).toBeNull; //Nolink

    //Generate the snapshot
    expect(container).toMatchSnapshot();
  });
});
