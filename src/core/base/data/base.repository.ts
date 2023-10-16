import { Cache } from 'cache-manager';
import { IContext } from '../frameworks/shared/interceptors/context.interceptor';
import { IListResult, TPrismaTx } from '../domain/entities';
import { CreateRepository } from './methods/create.repository';
import {
  DeleteRepository,
  GetRepository,
  ListRepository,
  UpdateRepository,
} from './methods';

export abstract class BaseRepository<
  T extends Record<string, any>,
  C = any,
  U = any,
> {
  protected _entity: string;
  protected cacheManager: Cache;

  constructor(entity: new () => T, cacheManager: Cache) {
    this._entity = entity.name.toLowerCase();
    this.cacheManager = cacheManager;
  }

  async listDropdown(tx: TPrismaTx): Promise<Pick<T, 'id' | 'name'>[]> {
    return ListRepository.listDropDown<T>(tx, this._entity);
  }

  async create(body: C, tx: TPrismaTx): Promise<T> {
    return CreateRepository.create<T, C>(
      body,
      tx,
      this._entity,
      this.cacheManager,
    );
  }

  async update(id: string, body: U, tx: TPrismaTx): Promise<T> {
    return UpdateRepository.update<T, U>(
      id,
      body,
      tx,
      this._entity,
      this.cacheManager,
    );
  }

  async delete(id: string, tx: TPrismaTx): Promise<T> {
    return DeleteRepository.delete<T>(id, tx, this._entity, this.cacheManager);
  }

  async deleteBatch(ids: string[], tx: TPrismaTx): Promise<{ count: number }> {
    return DeleteRepository.deleteBatch(
      ids,
      tx,
      this._entity,
      this.cacheManager,
    );
  }

  async get(id: string, tx: TPrismaTx): Promise<T> {
    return GetRepository.get<T>(id, tx, this._entity, this.cacheManager);
  }

  async list(ctx: IContext, tx: TPrismaTx): Promise<IListResult<T>> {
    return ListRepository.list<T>(ctx, tx, this._entity);
  }
}
