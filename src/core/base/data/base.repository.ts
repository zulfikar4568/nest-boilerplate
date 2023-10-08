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

  constructor(entity: new () => T) {
    this._entity = entity.name.toLowerCase();
  }

  async listDropdown(tx: TPrismaTx): Promise<Pick<T, 'id' | 'name'>[]> {
    const listRepository = new ListRepository<T>();

    return listRepository.listDropDown(tx, this._entity);
  }

  async create(body: C, tx: TPrismaTx): Promise<T> {
    const createRepository = new CreateRepository<T, C>();

    return createRepository.create(body, tx, this._entity);
  }

  async update(id: string, body: U, tx: TPrismaTx): Promise<T> {
    const updateRepository = new UpdateRepository<T, U>();

    return updateRepository.update(id, body, tx, this._entity);
  }

  async delete(id: string, tx: TPrismaTx): Promise<T> {
    const deleteRepository = new DeleteRepository<T>();

    return deleteRepository.delete(id, tx, this._entity);
  }

  async get(id: string, tx: TPrismaTx): Promise<T> {
    const getRepository = new GetRepository<T>();

    return getRepository.get(id, tx, this._entity);
  }

  async list(ctx: IContext, tx: TPrismaTx): Promise<IListResult<T>> {
    const listRepository = new ListRepository<T>();

    return listRepository.list(ctx, tx, this._entity);
  }
}
