import { useNavigationStore } from '@/app/ihbc/stores/navigationStore';
import { Button } from '@/components/foundation/Button';
import { Row } from '@/components/foundation/Row';
import { DentalVisionPlan } from './DentalVisionPlan';

export const DentalVisionPlanPage = () => {
  const [goBackWard, goForward] = useNavigationStore((state) => [
    state.goBackWard,
    state.goForward,
  ]);

  return (
    <div>
      <DentalVisionPlan />
      <Row className="justify-between">
        <Button className="w-fit" callback={goBackWard} label="Back" />
        <Button className="w-fit" callback={goForward} label="Next" />
      </Row>
    </div>
  );
};
