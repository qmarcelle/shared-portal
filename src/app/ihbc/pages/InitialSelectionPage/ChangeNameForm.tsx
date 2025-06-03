import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextField } from '@/components/foundation/TextField';
import { useFormContext } from 'react-hook-form';
import { IHBCSchema } from '../../rules/schema';

export const ChangeNameForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IHBCSchema>();

  return (
    <Column className="gap-2">
      <Row className="gap-4">
        <TextField
          otherProps={register('changePersonalInfo.changeName.lastName')}
          label="Last Name"
          errors={[errors.changePersonalInfo?.changeName?.lastName?.message]}
        />
        <TextField
          otherProps={register('changePersonalInfo.changeName.firstName')}
          label="First Name"
          errors={[errors.changePersonalInfo?.changeName?.firstName?.message]}
        />
        <TextField
          otherProps={register('changePersonalInfo.changeName.mi')}
          label="MI"
          errors={[errors.changePersonalInfo?.changeName?.mi?.message]}
        />
      </Row>
      <TextField label="Reason for Change" />
    </Column>
  );
};
