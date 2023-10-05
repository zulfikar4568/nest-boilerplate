import { Injectable } from '@nestjs/common';
import { Dashboard, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { NotFoundException } from '../../../shared/exceptions/common.exception';
import { IDashboardRepository } from '@/core/abstracts/repositories/dashboard.repository';
import {
  TCreateDashboardRequestBody,
  TPrismaTx,
  TUpdateDashboardRequestBody,
} from '@/core/entities';

@Injectable()
export class DashboardRepository implements IDashboardRepository {
  async simpleAllData(
    tx: TPrismaTx,
  ): Promise<Pick<Dashboard, 'id' | 'name'>[]> {
    const dashboard = await tx.dashboard.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return dashboard;
  }

  async create(
    body: TCreateDashboardRequestBody,
    tx: TPrismaTx,
  ): Promise<Dashboard> {
    const dashboard = await tx.dashboard.create({
      data: body,
    });

    return dashboard;
  }

  async update(
    id: string,
    body: TUpdateDashboardRequestBody,
    tx: TPrismaTx,
  ): Promise<Dashboard> {
    const dashboard = await tx.dashboard.update({
      where: { id },
      data: body,
    });

    return dashboard;
  }

  async deleteById(id: string, tx: TPrismaTx): Promise<Dashboard> {
    const dashboard = await tx.dashboard.delete({
      where: { id },
    });

    return dashboard;
  }

  async getById(id: string, tx: TPrismaTx): Promise<Dashboard> {
    const dashboard = await tx.dashboard.findUnique({
      where: {
        id,
      },
    });

    if (!dashboard) {
      throw new NotFoundException({
        message: `Dashboard dengan id ${id} tidak ditemukan!`,
      });
    }

    return dashboard;
  }

  async getCountAndListTransaction(
    findManyArgs: Prisma.DashboardFindManyArgs<DefaultArgs>,
    countArgs: Prisma.DashboardCountArgs<DefaultArgs>,
    tx: TPrismaTx,
  ): Promise<{
    total: number;
    dashboard: Dashboard[];
  }> {
    const total = await tx.dashboard.count(countArgs);
    const dashboard = await tx.dashboard.findMany(findManyArgs);

    return {
      total,
      dashboard,
    };
  }
}
