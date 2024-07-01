import { useState } from "react";
import Image from "next/image";
import { alertErrorIcon } from "./Icons";
import { Row } from "./Row";

export interface TextFieldProps {
  label: string;
  type?: "text" | "password";
  errors?: string[] | null;
  fillGuidance?: string[] | null;
  value?: string;
  hint?: string;
  valueCallback?: (value: string) => void;
  suffixIconCallback?: () => void;
  maxWidth?: number;
  isSuffixNeeded?: boolean;
}

const ObscureIndicator = ({ obscure }: { obscure: boolean }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="separator"></div>
      {obscure == true ? <div>Hidden</div> : <div>Showing</div>}
    </div>
  );
};

const ErrorIndicator = () => {
  return (
    <div className="flex flex-row items-center">
      <div className="separator"></div>
      <div>Error</div>
    </div>
  );
};

const SuffixIcon = ({
  type,
  errors,
  obscured,
}: {
  type: "text" | "password";
  errors?: string[] | null;
  obscured?: boolean | null;
}) => {
  if (errors) {
    return <ErrorIndicator />;
  } else {
    switch (type) {
      case "text":
        return null;
      case "password":
        return <ObscureIndicator obscure={obscured ?? true} />;
    }
  }
};

const Error = ({ errors }: { errors: string[] }) => {
  return (
    <div>
      {errors.map((item, index) => (
        <Row key={index}>
          <div className="inline-flex">
            <Image src={alertErrorIcon} className="icon" alt={"ErrorIcon"} />
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
    <div className={`${errors ? "error-container" : ""} mt-1 p-1`}>
      {errors && <Error errors={errors} />}
      {errors == null && fillGuidance && (
        <FillGuidance fillGuidance={fillGuidance} />
      )}
    </div>
  );
};

export const TextField = ({
  label,
  type = "text",
  errors,
  fillGuidance,
  value,
  hint,
  valueCallback,
  suffixIconCallback,
  maxWidth,
  isSuffixNeeded = false,
}: TextFieldProps) => {
  const [focus, setFocus] = useState(false);
  const [obscuredState, setObscuredState] = useState(
    type == "password" ? true : false
  );

  function computeType(): typeof type {
    if (type == "password") {
      return obscuredState == true ? type : "text";
    }

    return type;
  }

  function toggleObscure() {
    if (type == "password") {
      setObscuredState(!obscuredState);
    }
    suffixIconCallback?.();
  }

  return (
    <div
      style={{ ...(maxWidth && { maxWidth: `${maxWidth}px` }) }}
      className="flex flex-col w-full"
    >
      <p>{label}</p>
      <div
        className={`flex flex-row items-center input ${
          focus ? "input-focus" : ""
        } ${errors ? "error-input" : ""}`}
      >
        <input
          aria-label={label}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(event) => valueCallback?.(event.target.value)}
          value={value}
          placeholder={hint}
          type={computeType()}
        />
        <div className="cursor-pointer" onClick={toggleObscure}>
          {isSuffixNeeded && (
            <SuffixIcon errors={errors} type={type} obscured={obscuredState} />
          )}
        </div>
      </div>
      <LowerPart errors={errors} fillGuidance={fillGuidance} />
    </div>
  );
};
