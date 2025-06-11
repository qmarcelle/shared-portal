import { FilterItem } from '@/models/filter_dropdown_details';
import { VisibilityRules } from '@/visibilityEngine/rules';

export interface PriorAuthData {
  phoneNumber: string;
  visibilityRules?: VisibilityRules;
  filterList: FilterItem[];
}
