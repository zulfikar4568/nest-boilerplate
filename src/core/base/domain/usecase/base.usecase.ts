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
  Entity extends Record<string, any>,
  Include extends Record<string, any>,
  Select extends Record<string, any>,
  Where extends Record<string, any>,
> extends BaseCoreUseCase<Entity, Include, Select, Where> {
  constructor(
    protected readonly repository: BaseRepository<
      Entity,
      Include,
      Select,
      Where
    >,
    protected db: PrismaService,
  ) {
    super(repository, db);
  }

  @Span('usecase list dropdown')
  async listDropdown(): Promise<Pick<Entity, 'id' | 'name'>[]> {
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
