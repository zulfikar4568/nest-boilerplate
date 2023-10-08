import { Injectable } from '@nestjs/common';
import { Dashboard } from '@prisma/client';
import {
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody,
} from '../entities/dashboard.entity';
import { DashboardRepository } from '../../data/dashboard.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '@/core/base/domain/usecase/base.usecase';

@Injectable()
export class DashboardUseCase extends BaseUseCase<
  Dashboard,
  TCreateDashboardRequestBody,
  TUpdateDashboardRequestBody
> {
  constructor(repository: DashboardRepository, db: PrismaService) {
    super(repository, db);
  }
}
