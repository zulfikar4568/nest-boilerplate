import { Module } from '@nestjs/common';
import { DashboardRepository } from './data/dashboard.repository';
import { DashboardController } from './infrastructure/dashboard.controller';
import { DashboardUseCase } from './domain/usecase/dashboard.usecase';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Module({
  providers: [DashboardRepository, DashboardUseCase, PrismaService],
  controllers: [DashboardController],
  exports: [DashboardRepository],
})
export class DashboardModule {}
