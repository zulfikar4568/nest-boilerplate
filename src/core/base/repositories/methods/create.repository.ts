import { ICreateRepository } from '../../abstract/methods';
import { TPrismaTx } from '@/core/entities';

export class CreateRepository<T extends Record<string, any>, B>
  implements ICreateRepository<T, B>
{
  async create(body: B, tx: TPrismaTx, entity: string): Promise<T> {
    const data = await tx[entity].create({
      data: body,
    });

    return data;
  }
}
