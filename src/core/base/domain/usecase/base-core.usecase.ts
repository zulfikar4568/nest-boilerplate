import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Span } from 'nestjs-otel';
import log from '../../frameworks/shared/utils/log.util';
import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import {
  EErrorCommonCode,
  UnknownException,
} from '../../frameworks/shared/exceptions/common.exception';
import { IListResult } from '../entities';
import PrismaService from '../../frameworks/data-services/prisma/prisma.service';
import { BaseCoreRepository } from '../../data/base-core.repository';

export abstract class BaseCoreUseCase<T extends Record<string, any>> {
  constructor(
    protected readonly repository: BaseCoreRepository<T>,
    protected db: PrismaService,
  ) {}

  @Span('usecase create')
  async create(body: any): Promise<T> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.create(body, tx);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `something wrong when trying to create!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase get')
  async get(params: { id: string }): Promise<T> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.get(params.id, tx);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `something wrong when trying to get information!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase update')
  async update(params: { id: string }, body: any): Promise<T> {
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
          message: `something wrong when trying to update!`,
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
          message: `something wrong when trying to batch deletion!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase delete')
  async delete(params: { id: string }): Promise<T> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.get(params.id, tx);
        return await this.repository.delete(params.id, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `something wrong when trying to delete!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase list')
  async list(ctx: IContext): Promise<IListResult<T>> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.repository.list(ctx, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `something wrong when trying to get the list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
