import { TPrismaTx } from '@/core/entities';

export interface IDeleteRepository<T extends Record<string, any>> {
  delete(id: string, tx: TPrismaTx, entity: string): Promise<T>;
}
