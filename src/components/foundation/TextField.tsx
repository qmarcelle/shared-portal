import Image from 'next/image';
import { useState } from 'react';
import { IComponent } from '../IComponent';
import { resolveMaxWidth } from '../MaxWidthResolver';
import {
  alertErrorIcon,
  showPasswordIcon,
  showPasswordSelectedIcon,
} from './Icons';
import { Row } from './Row';

export interface TextFieldProps extends IComponent {
  label: string | undefined;
  type?: 'text' | 'password' | 'email' | 'number';
  errors?: (string | undefined)[] | null;
  fillGuidance?: string[] | null;
  value?: string | number;
  hint?: string;
  valueCallback?: (value: string) => void;
  onKeydownCallback?: (key: string) => void;
  suffixIconCallback?: () => void;
  maxWidth?: number | string; // Allow both number and string for flexibility
  isSuffixNeeded?: boolean;
  highlightError?: boolean;
  onFocusCallback?: () => void;
  minValue?: number;
  maxValue?: number;
  maxLength?: number;
  disabled?: boolean;
  list?: string;
  otherProps?: any;
  required?: boolean;
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
          <Image src={showPasswordSelectedIcon} className="icon" alt="" />
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
            <Image src={alertErrorIcon} className="icon" alt="" />
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
  console.error('text field errors', errors);
  return (
    <div
      className={`${(errors?.length ?? 0) > 0 ? 'error-container' : ''} mt-1 p-1`}
    >
      {errors && <Error errors={errors} />}
      {errors == null && fillGuidance && (
        <FillGuidance fillGuidance={fillGuidance} />
      )}
    </div>
  );
};

export const TextField = ({
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
  list,
  otherProps,
  required,
}: TextFieldProps) => {
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

  const resolvedMaxWidth = resolveMaxWidth(maxWidth);

  const filteredErrors: string[] = (errors?.filter(Boolean) as string[]) ?? [];

  return (
    <div
      style={{ ...(resolvedMaxWidth && { maxWidth: resolvedMaxWidth }) }}
      className="flex flex-col w-full text-field"
    >
      {label && (
        <p>
          {required && <span className="text-red-500 ml-1">* </span>}
          {label}
        </p>
      )}
      <div
        className={`flex flex-row items-center input ${className} ${
          focus ? 'input-focus' : ''
        } ${(filteredErrors?.length ?? 0) > 0 && highlightError ? 'error-input' : ''}`}
      >
        <input
          aria-label={label}
          onFocus={() => {
            setFocus(true);
            onFocusCallback?.();
          }}
          onChange={(event) => valueCallback?.(event.target.value)}
          onKeyDown={(event) => onKeydownCallback?.(event.key)}
          value={value}
          placeholder={hint}
          type={computeType()}
          min={minValue}
          max={maxValue}
          className={className}
          maxLength={maxLength}
          disabled={disabled}
          list={list}
          {...otherProps}
          onBlur={(e) => {
            otherProps?.onBlur(e);
            setFocus(false);
          }}
        />
        <div className="cursor-pointer" onClick={toggleObscure}>
          {isSuffixNeeded && (
            <SuffixIcon
              errors={filteredErrors}
              type={type}
              obscured={obscuredState}
            />
          )}
        </div>
      </div>
      {(filteredErrors.length > 0 || fillGuidance) && (
        <LowerPart errors={filteredErrors} fillGuidance={fillGuidance} />
      )}
    </div>
  );
};
