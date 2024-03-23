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
import { BaseRepository } from '../../data/base.repository';

export abstract class BaseUseCase<
  Entity extends Record<string, any>,
  Include extends Record<string, any>,
  Select extends Record<string, any>,
  Where extends Record<string, any>,
  Create extends Record<string, any>,
  CreateMany extends Record<string, any>,
  Update extends Record<string, any>,
> {
  constructor(
    protected readonly repository: BaseRepository<
      Entity,
      Include,
      Select,
      Where,
      Create,
      CreateMany,
      Update
    >,
    protected db: PrismaService,
  ) {}

  @Span('usecase list dropdown')
  async listDropdown(ctx: IContext): Promise<Pick<Entity, 'id' | 'name'>[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.repository.listDropdown(ctx, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a simple list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase upsert')
  async upsert(
    body: any,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    try {
      const create: Create = body;
      const update: Update = body;

      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.upsert(
          body.name,
          tx,
          create,
          update,
          include,
          select,
          where,
        );
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during upsert the data!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

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
          message: `Error unexpected during create the data!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase get')
  async getById(params: { id: string }, include?: Include): Promise<Entity> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.getById(params.id, tx, include);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve the information!`,
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
          message: `Error unexpected during change the data!`,
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
          message: `Error unexpected during delete the datas!`,
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
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.getById(params.id, tx);
        return await this.repository.delete(
          params.id,
          tx,
          include,
          select,
          where,
        );
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete the data!`,
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
          message: `Error unexpected during retrieve a list!`,
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
          message: `Error unexpected during retrieve a list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
