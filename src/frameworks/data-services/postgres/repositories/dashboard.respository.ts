import { Dashboard } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { IGenericRepository } from '../../../../core/abstracts';
import PrismaService from '../prisma/prisma.service';

@Injectable()
export class DashboardRepository implements IGenericRepository<Dashboard> {
  private _repository: PrismaService;

  constructor(repository: PrismaService) {
    this._repository = repository;
  }

  async getAll(): Promise<Dashboard[]> {
    return await this._repository.dashboard.findMany();
  }

  async get(id: string): Promise<Dashboard> {
    const dashboard = await this._repository.dashboard.findUnique({
      where: { id: id },
    });

    if (!dashboard) throw new Error(`Dashboard ${id} not found!`);
    return dashboard;
  }
  create(item: Dashboard): Promise<Dashboard> {
    return this._repository.dashboard.create({
      data: item,
    });
  }
  update(id: string, item: Dashboard): Promise<Dashboard> {
    return this._repository.dashboard.update({
      data: item,
      where: { id: id },
    });
  }
}
