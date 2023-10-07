import { IListResult, TPrismaTx } from '@/core/entities';
import { IContext } from '@/frameworks/shared/interceptors/context.interceptor';

export interface IGenericRepository<T extends Record<string, any>, C, U> {
  listDropdown(tx: TPrismaTx): Promise<Pick<T, 'id' | 'name'>[]>;
  list(ctx: IContext, tx: TPrismaTx): Promise<IListResult<T>>;
  get(id: string, tx: TPrismaTx): Promise<T>;
  create(body: C, tx: TPrismaTx): Promise<T>;
  update(id: string, body: U, tx: TPrismaTx): Promise<T>;
  delete(id: string, tx: TPrismaTx): Promise<T>;
}
