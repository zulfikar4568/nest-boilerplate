import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../../data/dashboard.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { BaseUseCase } from '@/core/base/domain/usecase/base.usecase';
import { Dashboard } from '../entities/dashboard.entity';

@Injectable()
export class DashboardUseCase extends BaseUseCase<Dashboard> {
  constructor(repository: DashboardRepository, db: PrismaService) {
    super(repository, db);
  }
}
