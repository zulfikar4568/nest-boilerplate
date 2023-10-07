import { Injectable } from '@nestjs/common';
import { Dashboard } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Span } from 'nestjs-otel';
import { IAuditServices, IDataServices } from '../../core/abstracts';
import PrismaService from '../../frameworks/data-services/postgres/prisma/prisma.service';
import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import { parseQueryCursor } from '../../frameworks/shared/utils/query-cursor.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '../..//frameworks/shared/exceptions/common.exception';
import log from '../../frameworks/shared/utils/log.util';
import {
  IListResult,
  TCreateDashboardRequestBody,
  TDeleteDashboardByIdRequestParams,
  TListDashboardRequestQuery,
  TUpdateDashboardByIdRequestParams,
  TUpdateDashboardRequestBody,
} from '../../core/entities';

@Injectable()
export class DashboardUseCase {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly auditServices: IAuditServices<Dashboard>,
    private db: PrismaService,
  ) {}

  @Span('Usecase All Simple Dashboards')
  async allSimpleDashboard(): Promise<Pick<Dashboard, 'id' | 'name'>[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.dataServices.dashboards.simpleAllData(tx);
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
  async createDashboard(body: TCreateDashboardRequestBody): Promise<Dashboard> {
    try {
      const dashboard = await this.db.$transaction(async (tx) => {
        return await this.dataServices.dashboards.create(body, tx);
      });

      // Setelah selesai kirim ke dashboard, kirim ke notifikasi ke audit
      await this.auditServices.addHistoryAudit(dashboard);

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
  async updateDashboard(
    params: TUpdateDashboardByIdRequestParams,
    body: TUpdateDashboardRequestBody,
  ): Promise<Dashboard> {
    try {
      const dashboard = await this.db.$transaction(async (tx) => {
        return await this.dataServices.dashboards.update(params.id, body, tx);
      });

      // Setelah selesai kirim ke dashboard, kirim ke notifikasi ke audit
      await this.auditServices.addHistoryAudit(dashboard);

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
  async deleteBarang(
    params: TDeleteDashboardByIdRequestParams,
  ): Promise<Dashboard> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.dataServices.dashboards.getById(params.id, tx);
        return await this.dataServices.dashboards.deleteById(params.id, tx);
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
  async listDashboard(ctx: IContext): Promise<IListResult<Dashboard>> {
    try {
      return await this.db.$transaction(async (tx) => {
        const query = ctx.params.query as TListDashboardRequestQuery;

        const { limit, order, cursor } =
          parseQueryCursor<TListDashboardRequestQuery>(query);

        const selectOptions = {
          orderBy: order,
          where: query.filters.field,
        };

        let pageOptions = {
          take: limit,
        };

        if (cursor !== undefined && cursor !== '') {
          await this.dataServices.dashboards.getById(cursor, tx);

          pageOptions = {
            ...pageOptions,
            ...{ cursor: { id: cursor }, skip: 1 },
          };
        }

        const queryData =
          await this.dataServices.dashboards.getCountAndListTransaction(
            { ...pageOptions, ...selectOptions },
            selectOptions,
            tx,
          );

        const lastCursor =
          queryData.dashboard.length > 0
            ? queryData.dashboard[queryData.dashboard.length - 1].id
            : '';

        return {
          result: queryData.dashboard,
          meta: {
            lastCursor: lastCursor,
            total: queryData.total,
          },
        };
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
