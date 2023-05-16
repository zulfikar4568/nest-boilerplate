import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices, IGenericRepository } from '../../../core/abstracts';
import { Dashboard } from '../../../core/entities';
import { PostgresGenericRepository } from './postgres-generic.repository';
import { PostgresDashboardModel } from './model';

@Injectable()
export class PostgresDataService
  implements IDataServices, OnApplicationBootstrap
{
  dashboards: IGenericRepository<Dashboard>;

  constructor(private dashboardRepository: PostgresDashboardModel) {}

  onApplicationBootstrap(): void {
    this.dashboards = new PostgresGenericRepository<Dashboard>(
      this.dashboardRepository,
    );
  }
}
