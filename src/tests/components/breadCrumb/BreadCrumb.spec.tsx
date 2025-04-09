import { BreadCrumb, BreadcrumbItem } from '@/components/composite/BreadCrumb';
//import {BreadCrumb} from './components/composite/BreadCrumb'
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";



const items: BreadcrumbItem[] =[
  { path: '/member/myplan',label: 'My Plan',},
  { path: '/claims',label: 'Claims',}
];

const renderUI = () => { 
  return render(<BreadCrumb items ={items}/>);
};

describe('BreadCrumb', () => {
  test("render breadcrumb items correctly",()=>{
    
    const {container} = renderUI();

    //check if all the breadcrumbs item are rendered
    expect(screen.getByText("My Plan")).toBeInTheDocument();
    expect(screen.getByText("Claims")).toBeInTheDocument();


    //check if link exists for the correct items
    expect(screen.getByText("My Plan").closest("a")).toHaveAttribute("href","/member/myplan");
    expect(screen.getByText("Claims").closest("a")).toBeNull; //Nolink

    //Generate the snapshot
    expect(container).toMatchSnapshot();

  })

});

