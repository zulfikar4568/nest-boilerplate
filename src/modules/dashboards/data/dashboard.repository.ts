import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
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
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(Dashboard, cacheManager);
  }
}
