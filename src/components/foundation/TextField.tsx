import Image from 'next/image';
import { forwardRef, useState } from 'react';
import { IComponent } from '../IComponent';
import {
  alertErrorIcon,
  showPasswordIcon,
  showPasswordSelectedIcon,
} from './Icons';
import { Row } from './Row';

export interface TextFieldProps extends IComponent {
  label: string;
  type?: 'text' | 'password' | 'email' | 'number';
  errors?: string[] | null;
  fillGuidance?: string[] | null;
  value?: string | number;
  hint?: string;
  valueCallback?: (value: string) => void;
  onKeydownCallback?: (key: string) => void;
  suffixIconCallback?: () => void;
  maxWidth?: number;
  isSuffixNeeded?: boolean;
  highlightError?: boolean;
  onFocusCallback?: () => void;
  minValue?: number;
  maxValue?: number;
  maxLength?: number;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const ObscureIndicator = ({ obscure }: { obscure: boolean }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="separator"></div>
      {obscure == true ? (
        <div>
          <Image src={showPasswordIcon} className="icon" alt="Showpassword" />
        </div>
      ) : (
        <div>
          <Image
            src={showPasswordSelectedIcon}
            className="icon"
            alt={'Showpassword'}
          />
        </div>
      )}
    </div>
  );
};

const SuffixIcon = ({
  type,
  obscured,
}: {
  type: 'text' | 'password' | 'email' | 'number';
  errors?: string[] | null;
  obscured?: boolean | null;
}) => {
  switch (type) {
    case 'text':
      return null;
    case 'password':
      return <ObscureIndicator obscure={obscured ?? true} />;
  }
};

const Error = ({ errors }: { errors: string[] }) => {
  // return <div>
  //     {errors.length > 1 ? errors.map(item => <li key={item} >{item}</li>) : <p>{errors[0]}</p>}
  // </div>
  return (
    <div>
      {errors.map((item) => (
        <Row key={item}>
          <div className="inline-flex">
            <Image src={alertErrorIcon} className="icon" alt={'ErrorIcon'} />
            <p className="ml-2">{item}</p>
          </div>
        </Row>
      ))}
    </div>
  );
};

const FillGuidance = ({ fillGuidance }: { fillGuidance: string[] }) => {
  return (
    <div>
      {fillGuidance.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </div>
  );
};

const LowerPart = ({
  errors,
  fillGuidance,
}: {
  errors?: string[] | null;
  fillGuidance?: string[] | null;
}) => {
  return (
    <div className={`${errors ? 'error-container' : ''} mt-1 p-1`}>
      {errors && <Error errors={errors} />}
      {errors == null && fillGuidance && (
        <FillGuidance fillGuidance={fillGuidance} />
      )}
    </div>
  );
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      type = 'text',
      errors = null,
      fillGuidance = null,
      value,
      hint,
      valueCallback,
      onFocusCallback,
      suffixIconCallback,
      onKeydownCallback,
      maxWidth,
      isSuffixNeeded = false,
      minValue,
      maxValue,
      maxLength,
      className = '',
      highlightError = true,
      disabled = false,
      ariaLabel,
      ariaDescribedBy,
    },
    ref,
  ) => {
    const [focus, setFocus] = useState(false);
    const [obscuredState, setObscuredState] = useState(
      type == 'password' ? true : false,
    );

    function computeType(): typeof type {
      if (type == 'password') {
        return obscuredState == true ? type : 'text';
      }

      return type;
    }

    function toggleObscure() {
      if (type == 'password') {
        setObscuredState(!obscuredState);
      }
      suffixIconCallback?.();
    }

    return (
      <div
        style={{ ...(maxWidth && { maxWidth: `${maxWidth}px` }) }}
        className="flex flex-col w-full text-field"
      >
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div
          className={`flex flex-row items-center input ${className} ${
            focus ? 'input-focus' : ''
          } ${(errors?.length ?? 0) > 0 && highlightError ? 'error-input' : ''}`}
        >
          <input
            ref={ref}
            aria-label={ariaLabel || label}
            onFocus={() => {
              setFocus(true);
              onFocusCallback?.();
            }}
            onBlur={() => setFocus(false)}
            onChange={(event) => valueCallback?.(event.target.value)}
            onKeyDown={(event) => onKeydownCallback?.(event.key)}
            value={value}
            placeholder={hint}
            type={computeType()}
            min={minValue}
            max={maxValue}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              highlightError ? 'border-red-500' : ''
            } ${className || ''}`}
            maxLength={maxLength}
            disabled={disabled}
            aria-describedby={ariaDescribedBy}
            aria-invalid={highlightError}
            aria-errormessage={errors?.length ? 'error-message' : undefined}
          />
          <div className="cursor-pointer" onClick={toggleObscure}>
            {isSuffixNeeded && (
              <SuffixIcon
                errors={errors}
                type={type}
                obscured={obscuredState}
              />
            )}
          </div>
        </div>
        {(errors || fillGuidance) && (
          <LowerPart errors={errors} fillGuidance={fillGuidance} />
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
