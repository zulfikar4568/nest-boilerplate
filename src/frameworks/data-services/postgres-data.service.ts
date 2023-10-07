import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from '../../core/abstracts';
import { GenericRepository } from '../../core/base/repositories/generic.repository';
import { IGenericRepository } from '../../core/base/abstract/generic.repository';
import {
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody,
} from '../../core/entities';

@Injectable()
export class PostgresDataService
  implements IDataServices, OnApplicationBootstrap
{
  dashboards: IGenericRepository<
    Dashboard,
    TCreateDashboardRequestBody,
    TUpdateDashboardRequestBody
  >;

  onApplicationBootstrap(): void {
    this.dashboards = new GenericRepository(Dashboard);
  }
}
