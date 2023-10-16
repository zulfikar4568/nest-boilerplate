import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';
import { GetRepository } from './get.repository';

export class UpdateRepository {
  static async update<T extends Record<string, any>, B>(
    id: string,
    body: B,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
  ): Promise<T> {
    await GetRepository.get(id, tx, entity, cacheManager);

    const data = await tx[entity].update({
      where: { id },
      data: body,
    });

    if (data) {
      await cacheManager.set(data.id, data);
    }

    return data;
  }
}
