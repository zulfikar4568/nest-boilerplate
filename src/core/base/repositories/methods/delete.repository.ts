import { IDeleteRepository } from '../../abstract/methods';
import { TPrismaTx } from '@/core/entities';

export class DeleteRepository<T extends Record<string, any>>
  implements IDeleteRepository<T>
{
  async delete(id: string, tx: TPrismaTx, entity: string): Promise<T> {
    const data = await tx[entity].delete({
      where: { id },
    });

    return data;
  }
}
