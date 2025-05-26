import { useEffect, useState } from 'react';
import { get, InternalFieldName, Path, useFormContext } from 'react-hook-form';

export const useSelectiveValidation = <T extends object>(
  name: Path<T> | Path<T>[] | readonly Path<T>[],
) => {
  const {
    formState: { isValidating },
    control,
  } = useFormContext<T>();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    revalidate();
  }, []);

  useEffect(() => {
    if (isValidating) {
      revalidate();
    }
  }, [isValidating]);

  async function revalidate() {
    const fieldNames = Array.isArray(name)
      ? name
      : ([name] as InternalFieldName[]);
    const { errors } = await control._runSchema(fieldNames);
    console.warn('SelectiveValidation Hook', errors);
    for (const fieldName of fieldNames) {
      const error = get(errors, fieldName);
      if (error) {
        setIsValid(false);
        return;
      }
    }
    setIsValid(true);
  }

  return isValid;
};
