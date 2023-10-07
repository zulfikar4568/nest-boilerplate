import { IGenericRepository } from '../base/abstract/generic.repository';
import {
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody,
} from '../entities';

export abstract class IDataServices {
  abstract dashboards: IGenericRepository<
    Dashboard,
    TCreateDashboardRequestBody,
    TUpdateDashboardRequestBody
  >;
}
