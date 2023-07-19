import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices, IGenericRepository } from '../../../core/abstracts';
import { Dashboard } from '../../../core/entities';
import { DashboardRepository } from './repositories/dashboard.respository';
import PrismaService from './prisma/prisma.service';

@Injectable()
export class PostgresDataService
  implements IDataServices, OnApplicationBootstrap
{
  dashboards: IGenericRepository<Dashboard>;

  constructor(private prismaService: PrismaService) {}

  onApplicationBootstrap(): void {
    this.dashboards = new DashboardRepository(this.prismaService);
  }
}
