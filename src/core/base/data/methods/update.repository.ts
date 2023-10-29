import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';
import { GetRepository } from './get.repository';

export class UpdateRepository {
  static async update<T extends Record<string, any>>(
    id: string,
    body: any,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<T> {
    await GetRepository.get(id, tx, entity, cacheManager);

    const data = await tx[entity].update({
      where: { id, ...where },
      data: body,
      include,
    });

    if (data) {
      await cacheManager.set(data.id, data);
    }

    return data;
  }
}
