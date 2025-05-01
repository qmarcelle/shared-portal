import { useGroup } from '@/app/providers/GroupProvider';
import { IComponent } from '../IComponent';
import { Column } from '../foundation/Column';
import { Row } from '../foundation/Row';
import { TextBox } from '../foundation/TextBox';

export interface FooterProps extends IComponent {}

export function Footer({ className }: FooterProps) {
  const { group } = useGroup();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full bg-gray-100 py-8 ${className ?? ''}`}>
      <Column className="app-content">
        <Row className="justify-between items-center">
          <TextBox text={`© ${currentYear} All rights reserved`} />
          <Row className="space-x-4">
            <TextBox
              className="hover:underline cursor-pointer"
              text="Privacy Policy"
            />
            <TextBox
              className="hover:underline cursor-pointer"
              text="Terms of Use"
            />
            <TextBox
              className="hover:underline cursor-pointer"
              text="Contact Us"
            />
          </Row>
        </Row>
      </Column>
    </footer>
  );
}
