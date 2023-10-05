import { IDashboardRepository } from './repositories/dashboard.repository';

export abstract class IDataServices {
  abstract dashboards: IDashboardRepository;
}
