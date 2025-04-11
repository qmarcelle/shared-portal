declare module 'react-hook-form' {
  export type FieldValues = Record<string, any>;

  export type UseFormRegister<TFieldValues extends FieldValues> = (
    name: string,
  ) => {
    onChange: (e: any) => void;
    onBlur: (e: any) => void;
    ref: (ref: any) => void;
    name: string;
  };

  export type FormState<TFieldValues extends FieldValues> = {
    isDirty: boolean;
    isSubmitted: boolean;
    isSubmitSuccessful: boolean;
    isSubmitting: boolean;
    isValidating: boolean;
    isValid: boolean;
    dirtyFields: Record<string, boolean>;
    touchedFields: Record<string, boolean>;
    errors: Record<string, { message?: string; type?: string }>;
  };

  export type UseFormReturn<TFieldValues extends FieldValues> = {
    register: UseFormRegister<TFieldValues>;
    formState: FormState<TFieldValues>;
    handleSubmit: (
      onSubmit: (data: TFieldValues) => any,
    ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    watch: (name?: string | string[]) => any;
    setValue: (
      name: string,
      value: any,
      options?: {
        shouldValidate?: boolean;
        shouldDirty?: boolean;
        shouldTouch?: boolean;
      },
    ) => void;
    trigger: (name?: string | string[]) => Promise<boolean>;
    getValues: (name?: string | string[]) => any;
    reset: (
      values?: TFieldValues,
      options?: {
        keepErrors?: boolean;
        keepDirty?: boolean;
        keepIsSubmitted?: boolean;
        keepValues?: boolean;
      },
    ) => void;
  };

  export function useForm<TFieldValues extends FieldValues>(options?: {
    mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
    reValidateMode?: 'onSubmit' | 'onBlur' | 'onChange';
    defaultValues?: Partial<TFieldValues>;
    resolver?: any;
  }): UseFormReturn<TFieldValues>;

  export function useFormContext<
    TFieldValues extends FieldValues,
  >(): UseFormReturn<TFieldValues>;

  export function FormProvider<TFieldValues extends FieldValues>(
    props: {
      children: React.ReactNode;
    } & UseFormReturn<TFieldValues>,
  ): JSX.Element;
}
