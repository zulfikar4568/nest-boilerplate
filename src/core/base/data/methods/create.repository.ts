import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';

export class CreateRepository {
  static async create<T extends Record<string, any>, B>(
    body: B,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
  ): Promise<T> {
    const data = await tx[entity].create({
      data: body,
    });

    if (data) {
      await cacheManager.set(data.id, data);
    }

    return data;
  }
}
