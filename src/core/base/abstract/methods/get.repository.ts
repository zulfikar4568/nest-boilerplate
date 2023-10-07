import { TPrismaTx } from '@/core/entities';
export interface IGetRepository<T extends Record<string, any>> {
  get(id: string, tx: TPrismaTx, entity: string): Promise<T>;
}
