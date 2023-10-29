import { Cache } from 'cache-manager';
import { TPrismaTx } from '../domain/entities';
import { ListRepository } from './methods';
import { BaseCoreRepository } from './base-core.repository';

export abstract class BaseRepository<
  T extends Record<string, any>,
> extends BaseCoreRepository<T> {
  constructor(entity: new () => T, cacheManager: Cache) {
    super(entity, cacheManager);
  }

  async listDropdown(tx: TPrismaTx): Promise<Pick<T, 'id' | 'name'>[]> {
    return ListRepository.listDropDown<T>(tx, this._entity);
  }
}
