import { CostForThisOptionDetails } from './cost_for_this_option_details';
import { HealthProgramHeaderCardDetails } from './health_program_header_card_details';
import { HealthProgramType } from './health_program_type';

export interface HealthProgramDetails {
  healthProgramType: HealthProgramType;
  healthProgramHeaderDetails: HealthProgramHeaderCardDetails;
  whyUseThisOptionDetails: string[];
  costForThisOptionDetails: CostForThisOptionDetails[];
  goodForOptionDetails: string[];
  programType?: string;
}
