import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';

export class CreateRepository {
  static async create<T extends Record<string, any>>(
    body: any,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Record<string, any>,
  ): Promise<T> {
    const data = await tx[entity].create({
      data: body,
      include,
    });

    if (data) {
      await cacheManager.set(data.id, data);
    }

    return data;
  }

  static async createMany<T extends Record<string, any>>(
    body: any,
    tx: TPrismaTx,
    entity: string,
  ): Promise<T[]> {
    const data = await tx[entity].createMany({
      data: body,
    });

    return data;
  }
}
