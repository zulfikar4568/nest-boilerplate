import { IUpdateRepository } from '../../abstract/methods';
import { TPrismaTx } from '@/core/entities';

export class UpdateRepository<T extends Record<string, any>, B>
  implements IUpdateRepository<T, B>
{
  async update(id: string, body: B, tx: TPrismaTx, entity: string): Promise<T> {
    const data = await tx[entity].update({
      where: { id },
      data: body,
    });

    return data;
  }
}
