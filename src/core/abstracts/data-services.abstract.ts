import { Dashboard } from '../entities';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract dashboards: IGenericRepository<Dashboard>;
}
