import { CalendarField } from '@/components/foundation/CalendarField';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { getNDaysDate } from '@/utils/date_formatter';

type EventDateDateFormProps = {
  effectiveDates: string[];
  eventDate: string | undefined;
  selectedDate: string | undefined;
  updateEventDate: (val: string) => void;
  updateSelectedEffectiveDate: (val: string) => void;
};

export const EventDateForm = ({
  eventDate,
  selectedDate,
  effectiveDates,
  updateEventDate,
  updateSelectedEffectiveDate,
}: EventDateDateFormProps) => {
  return (
    <Row className="gap-6">
      <CalendarField
        initValue={eventDate}
        label="Enter Date of Your event"
        isSuffixNeeded={true}
        minDate={getNDaysDate(-60)}
        maxDate={getNDaysDate(60)}
        minDateErrMsg="The date entered is out of range."
        maxDateErrMsg="The date entered is out of range."
        valueCallback={updateEventDate}
      />
      <Column className="w-full">
        <TextBox text="Effective Date" />
        <Dropdown
          items={[
            { label: 'Select Date', value: '0' },
            ...effectiveDates.map((item) => ({ label: item, value: item })),
          ]}
          onSelectCallback={updateSelectedEffectiveDate}
          initialSelectedValue={selectedDate ?? '0'}
        />
      </Column>
    </Row>
  );
};
