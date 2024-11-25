import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';

interface SendEmailRequestProps extends IComponent {
  icon?: JSX.Element;
}

export const SendEmailRequest = ({}: SendEmailRequestProps) => {
  return (
    <Card className="large-section">
      <Column>
        <Header className="title-2" text="Option 2: Send an Email Request" />
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="Enter your doctor's information in the form below.if there are any issues with your request, we'll contact you."
        />
        <Spacer size={32} />

        <Filter
          className="px-0 m-0 !border-none"
          filterHeading="Member Information"
          filterItems={[
            {
              type: 'dropdown',
              label: 'Member Name',
              value: [
                {
                  label: 'Chris Hall',
                  value: '1',
                  id: '1',
                },
                {
                  label: 'Forest Hall',
                  value: '2',
                  id: '2',
                },
              ],
              selectedValue: { label: 'Chris Hall', value: '1', id: '1' },
            },
          ]}
        />
        <Header className="title-2" text="Provider Information"></Header>
        <Spacer size={32} />
        <div>
          <TextField label="Name of Provider (First & Last Name)" />
          <Spacer size={32} />
        </div>

        <div>
          <TextField label="Street Address" />
          <Spacer size={32} />
        </div>

        <div>
          <TextField label="State" />
          <Spacer size={32} />
        </div>

        <div>
          <TextField label="ZIP Code" />
          <Spacer size={32} />
        </div>

        <div>
          <TextField label="Country" />
          <Spacer size={32} />
        </div>

        <div>
          <TextField label="Phone Number" hint="( ___ ) ___ - ___ " />
          <Spacer size={32} />
        </div>

        <div>
          <Button callback={() => null} label="Submit Request" />
          <Spacer size={32} />
        </div>
      </Column>
    </Card>
  );
};
