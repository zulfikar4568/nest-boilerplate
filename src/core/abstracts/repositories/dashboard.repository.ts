import { Dashboard, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import {
  TCreateDashboardRequestBody,
  TPrismaTx,
  TUpdateDashboardRequestBody,
} from '@/core/entities';

export interface IDashboardRepository {
  simpleAllData(tx: TPrismaTx): Promise<Pick<Dashboard, 'id' | 'name'>[]>;
  getById(id: string, tx: TPrismaTx): Promise<Dashboard>;
  getCountAndListTransaction(
    findManyArgs: Prisma.DashboardFindManyArgs<DefaultArgs>,
    countArgs: Prisma.DashboardCountArgs<DefaultArgs>,
    tx: TPrismaTx,
  ): Promise<{
    total: number;
    dashboard: Dashboard[];
  }>;
  create(body: TCreateDashboardRequestBody, tx: TPrismaTx): Promise<Dashboard>;
  update(
    id: string,
    body: TUpdateDashboardRequestBody,
    tx: TPrismaTx,
  ): Promise<Dashboard>;
  deleteById(id: string, tx: TPrismaTx): Promise<Dashboard>;
}
