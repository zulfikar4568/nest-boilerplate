import { NotFoundException } from '../../frameworks/shared/exceptions/common.exception';
import { TPrismaTx } from '../../domain/entities';

export class GetRepository {
  static async get<T extends Record<string, any>>(
    id: string,
    tx: TPrismaTx,
    entity: string,
  ): Promise<T> {
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
