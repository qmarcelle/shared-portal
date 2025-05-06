import { ServicesUsedItem } from '@/models/app/servicesused_details';
import { UIUser } from '@/models/app/uiUser';

export type ServicesUsedData = {
  members: UIUser[];
  services: Map<string, ServicesUsedItem[]>;
};
