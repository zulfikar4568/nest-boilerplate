import { Cache } from 'cache-manager';
import { IContext } from '../frameworks/shared/interceptors/context.interceptor';
import {
  IListCursorResult,
  IListPaginationResult,
  TPrismaTx,
} from '../domain/entities';
import { camelize } from '../frameworks/shared/utils/string.util';
import { CreateRepository } from './methods/create.repository';
import {
  DeleteRepository,
  GetRepository,
  ListRepository,
  UpdateRepository,
} from './methods';

export abstract class BaseCoreRepository<
  Entity extends Record<string, any>,
  Include extends Record<string, any>,
  Select extends Record<string, any>,
  Where extends Record<string, any>,
> {
  protected _entity: string;
  protected cacheManager: Cache;

  public defaultInclude: Include;
  public defaultSelect: Select;
  public defaultWhere: Where;

  constructor(entity: new () => Entity, cacheManager: Cache) {
    this._entity = camelize(entity.name);
    this.cacheManager = cacheManager;
  }

  async create(body: any, tx: TPrismaTx, include?: Include): Promise<Entity> {
    return CreateRepository.create<Entity, Include>(
      body,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
    );
  }

  async createMany(body: any, tx: TPrismaTx): Promise<Entity[]> {
    return CreateRepository.createMany<Entity>(body, tx, this._entity);
  }

  async update(
    id: string,
    body: any,
    tx: TPrismaTx,
    include?: Include,
    where?: Where,
  ): Promise<Entity> {
    return UpdateRepository.update<Entity, Include, Where>(
      id,
      body,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
      where ? where : this.defaultWhere,
    );
  }

  async delete(
    id: string,
    tx: TPrismaTx,
    include?: Include,
    where?: Where,
  ): Promise<Entity> {
    return DeleteRepository.delete<Entity, Include, Where>(
      id,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
      where ? where : this.defaultWhere,
    );
  }

  async deleteBatch(
    ids: string[],
    tx: TPrismaTx,
    where?: Where,
  ): Promise<{ count: number }> {
    return DeleteRepository.deleteBatch(
      ids,
      tx,
      this._entity,
      this.cacheManager,
      where ? where : this.defaultWhere,
    );
  }

  async get(
    id: string,
    tx: TPrismaTx,
    include?: Include,
    where?: Where,
  ): Promise<Entity> {
    return GetRepository.get<Entity, Include, Where>(
      id,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
      where ? where : this.defaultWhere,
    );
  }

  async getMany(
    tx: TPrismaTx,
    select?: Select,
    where?: Where,
  ): Promise<Entity[]> {
    return GetRepository.getMany<Entity, Select, Where>(
      tx,
      this._entity,
      select ? select : this.defaultSelect,
      where,
    );
  }

  async listCursor(
    ctx: IContext,
    tx: TPrismaTx,
    include?: Include,
    where?: Where,
  ): Promise<IListCursorResult<Entity>> {
    return ListRepository.listCursor<Entity, Include, Where>(
      ctx,
      tx,
      this._entity,
      include ? include : this.defaultInclude,
      where ? where : this.defaultWhere,
    );
  }

  async listPagination(
    ctx: IContext,
    tx: TPrismaTx,
    include?: Include,
    where?: Where,
  ): Promise<IListPaginationResult<Entity>> {
    return ListRepository.listPagination<Entity, Include, Where>(
      ctx,
      tx,
      this._entity,
      include ? include : this.defaultInclude,
      where ? where : this.defaultWhere,
    );
  }
}
