import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';
import { GetRepository } from './get.repository';

export class DeleteRepository {
  static async delete<T extends Record<string, any>>(
    id: string,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
  ): Promise<T> {
    await GetRepository.get(id, tx, entity, cacheManager);

    const data = await tx[entity].delete({
      where: { id },
    });

    if (data) {
      await cacheManager.del(data.id);
    }

    return data;
  }

  static async deleteBatch(
    ids: string[],
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
  ): Promise<Prisma.BatchPayload> {
    const deleted = await tx[entity].deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    // Delete the cached
    ids.forEach(async (id: string) => {
      if (await cacheManager.get(id)) await cacheManager.del(id);
    });

    return deleted;
  }
}
