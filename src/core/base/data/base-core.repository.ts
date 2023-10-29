import { Cache } from 'cache-manager';
import { IContext } from '../frameworks/shared/interceptors/context.interceptor';
import { IListResult, TPrismaTx } from '../domain/entities';
import { camelize } from '../frameworks/shared/utils/string.util';
import { CreateRepository } from './methods/create.repository';
import {
  DeleteRepository,
  GetRepository,
  ListRepository,
  UpdateRepository,
} from './methods';

export abstract class BaseCoreRepository<T extends Record<string, any>> {
  protected _entity: string;
  protected cacheManager: Cache;

  constructor(entity: new () => T, cacheManager: Cache) {
    this._entity = camelize(entity.name);
    this.cacheManager = cacheManager;
  }

  async create(
    body: any,
    tx: TPrismaTx,
    include?: Record<string, any>,
  ): Promise<T> {
    return CreateRepository.create<T>(
      body,
      tx,
      this._entity,
      this.cacheManager,
      include,
    );
  }

  async createMany(body: any, tx: TPrismaTx): Promise<T[]> {
    return CreateRepository.createMany<T>(body, tx, this._entity);
  }

  async update(
    id: string,
    body: any,
    tx: TPrismaTx,
    include?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<T> {
    return UpdateRepository.update<T>(
      id,
      body,
      tx,
      this._entity,
      this.cacheManager,
      include,
      where,
    );
  }

  async delete(
    id: string,
    tx: TPrismaTx,
    include?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<T> {
    return DeleteRepository.delete<T>(
      id,
      tx,
      this._entity,
      this.cacheManager,
      include,
      where,
    );
  }

  async deleteBatch(
    ids: string[],
    tx: TPrismaTx,
    where?: Record<string, any>,
  ): Promise<{ count: number }> {
    return DeleteRepository.deleteBatch(
      ids,
      tx,
      this._entity,
      this.cacheManager,
      where,
    );
  }

  async get(
    id: string,
    tx: TPrismaTx,
    include?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<T> {
    return GetRepository.get<T>(
      id,
      tx,
      this._entity,
      this.cacheManager,
      include,
      where,
    );
  }

  async getMany(
    tx: TPrismaTx,
    select?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<T[]> {
    return GetRepository.getMany<T>(tx, this._entity, select, where);
  }

  async list(
    ctx: IContext,
    tx: TPrismaTx,
    include?: Record<string, any>,
    where?: Record<string, any>,
  ): Promise<IListResult<T>> {
    return ListRepository.list<T>(ctx, tx, this._entity, include, where);
  }
}
