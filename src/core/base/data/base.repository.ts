import { Cache } from 'cache-manager';
import { TPrismaTx } from '../domain/entities';
import { ListRepository } from './methods';
import { BaseCoreRepository } from './base-core.repository';
import { IContext } from '../frameworks/shared/interceptors/context.interceptor';

export abstract class BaseRepository<
  Entity extends Record<string, any>,
  Include extends Record<string, any>,
  Select extends Record<string, any>,
  Where extends Record<string, any>,
> extends BaseCoreRepository<Entity, Include, Select, Where> {
  constructor(entity: new () => Entity, cacheManager: Cache) {
    super(entity, cacheManager);
  }

  async listDropdown(
    ctx: IContext,
    tx: TPrismaTx,
  ): Promise<Pick<Entity, 'id' | 'name'>[]> {
    return ListRepository.listDropDown<Entity>(ctx, tx, this._entity);
  }
}
