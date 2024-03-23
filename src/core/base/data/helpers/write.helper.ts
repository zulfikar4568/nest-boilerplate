import { Cache } from 'cache-manager';
import { TPrismaTx } from '../../domain/entities';
import { ReadHelper } from './read.helper';

export class WriteHelper {
  static async create<
    Entity extends Record<string, any>,
    Create extends Record<string, any>,
    Include extends Record<string, any>,
    Select extends Record<string, any>,
  >(
    body: Create,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Include,
    select?: Select,
  ): Promise<Entity> {
    const data = await tx[entity].create({
      data: body,
      include,
      select,
    });

    if (data) {
      await cacheManager.set(data.id, data);
    }

    return data;
  }

  static async createMany<
    Entity extends Record<string, any>,
    CreateMany extends Record<string, any>,
  >(body: CreateMany, tx: TPrismaTx, entity: string): Promise<Entity[]> {
    const data = await tx[entity].createMany({
      data: body,
    });

    return data;
  }

  static async upsert<
    Entity extends Record<string, any>,
    Create extends Record<string, any>,
    Update extends Record<string, any>,
    Include extends Record<string, any>,
    Select extends Record<string, any>,
    Where extends Record<string, any>,
  >(
    name: string,
    tx: TPrismaTx,
    entity: string,
    create: Create,
    update: Update,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    const upsert = await tx[entity].upsert({
      where: {
        name,
        ...where,
      },
      create,
      update,
      include,
      select,
    });

    return upsert;
  }

  static async update<
    Entity extends Record<string, any>,
    Update extends Record<string, any>,
    Include extends Record<string, any>,
    Select extends Record<string, any>,
    Where extends Record<string, any>,
  >(
    id: string,
    body: Update,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    await ReadHelper.getById(id, tx, entity, cacheManager);

    const data = await tx[entity].update({
      where: { id, ...where },
      data: body,
      include,
      select,
    });

    if (data) {
      await cacheManager.set(data.id, data);
    }

    return data;
  }
}
