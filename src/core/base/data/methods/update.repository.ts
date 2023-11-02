import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';
import { GetRepository } from './get.repository';

export class UpdateRepository {
  static async update<
    Entity extends Record<string, any>,
    Include extends Record<string, any>,
    Where extends Record<string, any>,
  >(
    id: string,
    body: any,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Include,
    where?: Where,
  ): Promise<Entity> {
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
