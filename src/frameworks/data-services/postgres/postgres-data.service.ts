import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from '../../../core/abstracts';
import { DashboardRepository } from './repositories/dashboard.respository';
import { IDashboardRepository } from '@/core/abstracts/repositories/dashboard.repository';

@Injectable()
export class PostgresDataService
  implements IDataServices, OnApplicationBootstrap
{
  dashboards: IDashboardRepository;

  onApplicationBootstrap(): void {
    this.dashboards = new DashboardRepository();
  }
}
