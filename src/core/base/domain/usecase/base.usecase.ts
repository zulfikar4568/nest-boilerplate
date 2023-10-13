import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Span } from 'nestjs-otel';
import { BaseRepository } from '../../data/base.repository';
import log from '../../frameworks/shared/utils/log.util';
import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import {
  EErrorCommonCode,
  UnknownException,
} from '../../frameworks/shared/exceptions/common.exception';
import { IListResult } from '../entities';
import PrismaService from '../../frameworks/data-services/prisma/prisma.service';

export abstract class BaseUseCase<T extends Record<string, any>, C, U> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected db: PrismaService,
  ) {}

  @Span('usecase list dropdown')
  async listDropdown(): Promise<Pick<T, 'id' | 'name'>[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.repository.listDropdown(tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error tidak terduga ketika mengambil informasi sederhana list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @Span('usecase create')
  async create(body: C): Promise<T> {
    try {
      const dashboard = await this.db.$transaction(async (tx) => {
        return await this.repository.create(body, tx);
      });

      return dashboard;
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

  @Span('usecase update')
  async update(params: { id: string }, body: U): Promise<T> {
    try {
      const dashboard = await this.db.$transaction(async (tx) => {
        return await this.repository.update(params.id, body, tx);
      });

      return dashboard;
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
          message: `Error tidak terduga ketika menghapus!`,
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
          message: `Error tidak terduga ketika mengambil list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
