import { Injectable } from '@nestjs/common';
import {
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody,
} from '../domain/entities/dashboard.entity';
import { BaseRepository } from '../../../core/base/data/base.repository';

@Injectable()
export class DashboardRepository extends BaseRepository<
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody
> {
  constructor() {
    super(Dashboard);
  }
}
