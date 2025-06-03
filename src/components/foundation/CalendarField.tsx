import { enUS } from 'date-fns/locale';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import alertErrorSvg from '../../../public/assets/alert_error_red.svg';
import { IComponent } from '../IComponent';
import { calenderIcon } from './Icons';
import { Row } from './Row';
import { TextBox } from './TextBox';
export interface CalendarFieldProps extends IComponent {
  type?: 'date';
  label: string | undefined;
  errors?: (string | undefined)[] | null;
  valueCallback?: (value: string) => void;
  onKeydownCallback?: (key: string) => void;
  maxWidth?: number | string; // Allow both number and string for flexibility
  isSuffixNeeded?: boolean;
  highlightError?: boolean;
  onFocusCallback?: () => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  minDateErrMsg?: string;
  maxDateErrMsg?: string;
  required?: boolean;
  initValue?: string;
  otherProps?: any;
  showYearDropdown?: boolean;
}

export const CalendarField = ({
  label,
  errors = [],
  onFocusCallback,
  isSuffixNeeded = false,
  type = 'date',
  className = '',
  minDate,
  maxDate,
  valueCallback,
  disabled,
  minDateErrMsg,
  maxDateErrMsg,
  maxWidth,
  required = false,
  initValue = '',
  otherProps,
  showYearDropdown = false,
}: CalendarFieldProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const datePickerRef = useRef<DatePicker>(null);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState(initValue);
  const [error, setError] = useState<string | undefined>('');

  const filteredErrors: string[] | undefined =
    (errors?.filter(Boolean) as string[]) ?? [];

  const focusCalender = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const CalenderIndicator = () => {
    return (
      <div className="flex flex-row items-center relative inline-block">
        <div className="separator"></div>
        <div>
          <Image src={calenderIcon} className="icon" alt="" />
        </div>
      </div>
    );
  };

  const SuffixIcon = ({ type }: { type: 'date'; errors?: string[] | null }) => {
    if (type === 'date') {
      return <CalenderIndicator />;
    }
    return null;
  };

  const customLocale = {
    ...enUS,
    localize: {
      ...enUS.localize,
      day: (n: number) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][n],
    },
  };
  registerLocale('customLocale', customLocale);

  // Function to format the input as MM/DD/YYYY
  const formatInputValue = (value: string) => {
    // Remove all non-numeric characters first
    value = value.replace(/\D/g, '');

    // Add slashes after 2 digits for month and day
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2); // MM/
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9); // MM/DD/YYYY
    }

    return value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      let rawValue = e.target.value;

      if (rawValue.length < inputValue.length && inputValue.endsWith('/')) {
        rawValue = rawValue.slice(0, -1);
      }
      // Remove non-numeric characters and ensure leading zeros are not stripped
      const formattedValue = formatInputValue(rawValue);
      setInputValue(formattedValue);

      if (formattedValue === '') {
        setError('');
      }

      if (!formattedValue) {
        setSelectedDate(null);
        valueCallback?.('');
        return;
      }

      // Check for errors if the date is fully filled out (MM/DD/YYYY)
      if (formattedValue.length === 10) {
        const [month, day, year] = formattedValue.split('/');

        const newDate = new Date(
          `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`,
        );

        if (Number.isNaN(newDate.getMonth())) {
          setError('Invalid Date');
          return;
        }

        minDate?.setHours(0, 0, 0, 0);
        maxDate?.setHours(0, 0, 0, 0);
        // Checks whether date is in given ranges
        if (minDate) {
          if (newDate < minDate) {
            valueCallback?.call(this, '');
            setError(minDateErrMsg);
            return;
          }
        }

        if (maxDate) {
          if (newDate > maxDate) {
            valueCallback?.call(this, '');
            setError(maxDateErrMsg);
            return;
          }
        }

        if (newDate.getFullYear() < 1900) {
          setError('Year must be greater than 1900');
        } else {
          console.log('Date Log', formattedValue);
          setSelectedDate(newDate);
          valueCallback?.call(this, formattedValue);
          setError(''); // Clear error
        }
      }
    } catch (err) {
      setError('Invalid Date!');
    }
  };

  // Sync inputValue with selectedDate
  useEffect(() => {
    if (selectedDate) {
      console.log('Formatted Date', selectedDate);
      const formattedDate = selectedDate
        ? `${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${String(selectedDate.getDate()).padStart(2, '0')}/${selectedDate.getFullYear()}`
        : '';
      otherProps?.onChange({
        target: { name: otherProps.name, value: formattedDate },
      });
      setInputValue(formattedDate);
    }
  }, [selectedDate]);

  // Determine the maxWidth with default to px if no unit is provided
  const resolvedMaxWidth =
    typeof maxWidth === 'number' || /^\d+$/.test(maxWidth as string)
      ? `${maxWidth}px`
      : maxWidth;

  return (
    <div
      ref={inputRef}
      style={{ ...(resolvedMaxWidth && { maxWidth: resolvedMaxWidth }) }}
      className={`flex flex-col relative inline-block w-full text-field ${error || filteredErrors.length > 0 ? 'border-red-500' : ''}`}
    >
      {label && (
        <p>
          {required && <span className="text-red-500 ml-1">* </span>}
          {label}
        </p>
      )}

      <div
        className={`flex flex-row items-center input relative w-full left-0 ${className} ${
          focus ? 'input-focus' : ''
        } ${error ? 'border !border-red-500' : ''}`}
      >
        <input
          {...otherProps}
          aria-label={label}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500' : ''}`}
          placeholder="__  / __  /  ____"
          maxLength={10} // Max length for MM/DD/YYYY
          onFocus={() => {
            setFocus(true);
            onFocusCallback?.();
          }}
          onBlur={(e) => {
            otherProps?.onBlur(e);
            setFocus(false);
          }}
          disabled={disabled}
        />
        <div className="cursor-pointer" onMouseDown={focusCalender}>
          {isSuffixNeeded && <SuffixIcon errors={filteredErrors} type={type} />}
        </div>
      </div>

      {(error || (filteredErrors?.length ?? 0) > 0) && (
        <div className="text-red-500 mt-1">
          <Row>
            <Image src={alertErrorSvg} className="icon mt-1" alt="" />
            <TextBox
              className="body-1 pt-1.5 ml-2"
              text={error ?? filteredErrors![0]}
            />
          </Row>
        </div>
      )}
      <div className="w-full h-0">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) {
              const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
              setInputValue(formattedDate);
              valueCallback?.(formattedDate);
              setError('');
            }
            setSelectedDate(date);
          }}
          locale="customLocale"
          ref={datePickerRef}
          calendarClassName="custom-calender-width"
          className="hidden"
          minDate={minDate}
          maxDate={maxDate}
          popperClassName="react-datepicker-custom-popper"
          disabled={disabled}
          showYearDropdown={showYearDropdown}
        />
      </div>
    </div>
  );
};
