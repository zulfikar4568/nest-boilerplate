import { Cache } from 'cache-manager';
import { NotFoundException } from '../../frameworks/shared/exceptions/common.exception';
import { TPrismaTx } from '../../domain/entities';

export class GetRepository {
  static async getMany<T extends Record<string, any>>(
    tx: TPrismaTx,
    entity: string,
    select?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<T[]> {
    const data = await tx[entity].findMany({
      where,
      select,
    });

    return data;
  }
  static async get<T extends Record<string, any>>(
    id: string,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<T> {
    const value = await cacheManager.get(id);

    if (!value) {
      const data = await tx[entity].findUnique({
        where: {
          id,
          ...where,
        },
        include,
      });

      if (!data) {
        throw new NotFoundException({
          message: `${entity} dengan id ${id} tidak ditemukan!`,
        });
      }

      await cacheManager.set(id, data);
      return data;
    }

    return value as T;
  }
}
