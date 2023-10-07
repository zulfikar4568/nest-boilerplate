import { TPrismaTx } from '@/core/entities';

export interface IUpdateRepository<T extends Record<string, any>, B> {
  update(id: string, body: B, tx: TPrismaTx, entity: string): Promise<T>;
}
