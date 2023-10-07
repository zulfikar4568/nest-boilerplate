import { Injectable } from '@nestjs/common';
import { Dashboard } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Span } from 'nestjs-otel';
import { IMessagingServices, IDataServices } from '../../core/abstracts';
import PrismaService from '../../frameworks/data-services/prisma/prisma.service';
import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import {
  EErrorCommonCode,
  UnknownException,
} from '../..//frameworks/shared/exceptions/common.exception';
import log from '../../frameworks/shared/utils/log.util';
import {
  IListResult,
  TCreateDashboardRequestBody,
  TDeleteDashboardByIdRequestParams,
  TUpdateDashboardByIdRequestParams,
  TUpdateDashboardRequestBody,
} from '../../core/entities';

@Injectable()
export class DashboardUseCase {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly auditServices: IMessagingServices<Dashboard>,
    private db: PrismaService,
  ) {}

  @Span('Usecase All Simple Dashboards')
  async listDropdown(): Promise<Pick<Dashboard, 'id' | 'name'>[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.dataServices.dashboards.listDropdown(tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengambil informasi sederhana list dashboard!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('Usecase Create Dashboard')
  async create(body: TCreateDashboardRequestBody): Promise<Dashboard> {
    try {
      const dashboard = await this.db.$transaction(async (tx) => {
        return await this.dataServices.dashboards.create(body, tx);
      });

      // Setelah selesai kirim ke dashboard, kirim ke notifikasi ke audit
      await this.auditServices.sendAudit(dashboard);

      return dashboard;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika ketika membuat dashboard!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('Usecase Update Dashboard')
  async update(
    params: TUpdateDashboardByIdRequestParams,
    body: TUpdateDashboardRequestBody,
  ): Promise<Dashboard> {
    try {
      const dashboard = await this.db.$transaction(async (tx) => {
        return await this.dataServices.dashboards.update(params.id, body, tx);
      });

      // Setelah selesai kirim ke dashboard, kirim ke notifikasi ke audit
      await this.auditServices.sendAudit(dashboard);

      return dashboard;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengubah dashboard!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('Usecase Delete Dashboard')
  async delete(params: TDeleteDashboardByIdRequestParams): Promise<Dashboard> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.dataServices.dashboards.get(params.id, tx);
        return await this.dataServices.dashboards.delete(params.id, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika menghapus dashboard!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('Usecase List Dashboard')
  async list(ctx: IContext): Promise<IListResult<Dashboard>> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.dataServices.dashboards.list(ctx, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengambil list dashboard!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
