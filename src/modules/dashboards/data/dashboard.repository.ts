import { Injectable } from '@nestjs/common';
import {
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody,
} from '../domain/entities/dashboard.entity';
import { GenericRepository } from '../../../core/base/data/generic.repository';

@Injectable()
export class DashboardRepository extends GenericRepository<
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody
> {
  constructor() {
    super(Dashboard);
  }
}
