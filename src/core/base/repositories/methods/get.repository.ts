import { IGetRepository } from '../../abstract/methods';
import { NotFoundException } from '../../../../frameworks/shared/exceptions/common.exception';
import { TPrismaTx } from '@/core/entities';

export class GetRepository<T extends Record<string, any>>
  implements IGetRepository<T>
{
  async get(id: string, tx: TPrismaTx, entity: string): Promise<T> {
    const data = await tx[entity].findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      throw new NotFoundException({
        message: `${entity} dengan id ${id} tidak ditemukan!`,
      });
    }

    return data;
  }
}
