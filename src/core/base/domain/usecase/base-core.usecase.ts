import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Span } from 'nestjs-otel';
import log from '../../frameworks/shared/utils/log.util';
import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import {
  EErrorCommonCode,
  UnknownException,
} from '../../frameworks/shared/exceptions/common.exception';
import { IListCursorResult, IListPaginationResult } from '../entities';
import PrismaService from '../../frameworks/data-services/prisma/prisma.service';
import { BaseCoreRepository } from '../../data/base-core.repository';

export abstract class BaseCoreUseCase<
  Entity extends Record<string, any>,
  Include extends Record<string, any>,
  Select extends Record<string, any>,
  Where extends Record<string, any>,
> {
  constructor(
    protected readonly repository: BaseCoreRepository<
      Entity,
      Include,
      Select,
      Where
    >,
    protected db: PrismaService,
  ) {}

  @Span('usecase create')
  async create(body: any, include?: Include): Promise<Entity> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.create(body, tx, include);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika ketika membuat!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase get')
  async get(
    params: { id: string },
    include?: Include,
    where?: Where,
  ): Promise<Entity> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.get(params.id, tx, include, where);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengambil informasi!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase update')
  async update(params: { id: string }, body: any): Promise<Entity> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.update(params.id, body, tx);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengubah!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase batch delete')
  async deleteBatch(body: { ids: string[] }): Promise<{ count: number }> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.repository.deleteBatch(body.ids, tx);
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika menghapus secara batch!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase delete')
  async delete(
    params: { id: string },
    include?: Include,
    where?: Where,
  ): Promise<Entity> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.get(params.id, tx);
        return await this.repository.delete(params.id, tx, include, where);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika menghapus!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase list pagination')
  async listPagination(
    ctx: IContext,
    include?: Include,
    where?: Where,
  ): Promise<IListPaginationResult<Entity>> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.repository.listPagination(ctx, tx, include, where);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengambil list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase list cursor')
  async listCursor(
    ctx: IContext,
    include?: Include,
    where?: Where,
  ): Promise<IListCursorResult<Entity>> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.repository.listCursor(ctx, tx, include, where);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengambil list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
