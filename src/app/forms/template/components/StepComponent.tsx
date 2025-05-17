import { FC } from 'react';

interface StepComponentProps {
  register: any;
  errors: any;
  setValue: any;
  watch: any;
}

const StepComponent: FC<StepComponentProps> = ({ register, errors }) => {
  return (
    <div>
      <label>
        Example Field:
        <input {...register('exampleField')} />
      </label>
      {errors.exampleField && <p>{errors.exampleField.message}</p>}
    </div>
  );
};

export default StepComponent;
