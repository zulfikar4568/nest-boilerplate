import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';

export class CreateRepository {
  static async create<
    Entity extends Record<string, any>,
    Include extends Record<string, any>,
  >(
    body: any,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Include,
  ): Promise<Entity> {
    const data = await tx[entity].create({
      data: body,
      include,
    });

    if (data) {
      await cacheManager.set(data.id, data);
    }

    return data;
  }

  static async createMany<Entity extends Record<string, any>>(
    body: any,
    tx: TPrismaTx,
    entity: string,
  ): Promise<Entity[]> {
    const data = await tx[entity].createMany({
      data: body,
    });

    return data;
  }
}
