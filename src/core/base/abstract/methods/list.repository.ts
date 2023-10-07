import { IListResult, TPrismaTx } from '@/core/entities';
import { IContext } from '@/frameworks/shared/interceptors/context.interceptor';

export interface IListRepository<T extends Record<string, any>> {
  listDropDown(
    tx: TPrismaTx,
    entity: string,
  ): Promise<Pick<T, 'id' | 'name'>[]>;
  list(ctx: IContext, tx: TPrismaTx, entity: string): Promise<IListResult<T>>;
}
