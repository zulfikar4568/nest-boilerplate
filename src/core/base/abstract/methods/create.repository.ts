import { TPrismaTx } from '@/core/entities';

export interface ICreateRepository<T extends Record<string, any>, B> {
  create(body: B, tx: TPrismaTx, entity: string): Promise<T>;
}
