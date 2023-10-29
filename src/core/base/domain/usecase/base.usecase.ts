import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Span } from 'nestjs-otel';
import { BaseRepository } from '../../data/base.repository';
import log from '../../frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '../../frameworks/shared/exceptions/common.exception';
import PrismaService from '../../frameworks/data-services/prisma/prisma.service';
import { BaseCoreUseCase } from './base-core.usecase';

export abstract class BaseUseCase<
  T extends Record<string, any>,
> extends BaseCoreUseCase<T> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected db: PrismaService,
  ) {
    super(repository, db);
  }

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
}
