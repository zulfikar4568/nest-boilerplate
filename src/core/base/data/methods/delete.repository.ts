import { Prisma } from '@prisma/client';
import { TPrismaTx } from '../../domain/entities';

export class DeleteRepository {
  static async delete<T extends Record<string, any>>(
    id: string,
    tx: TPrismaTx,
    entity: string,
  ): Promise<T> {
    const data = await tx[entity].delete({
      where: { id },
    });

    return data;
  }

  static async deleteBatch(
    ids: string[],
    tx: TPrismaTx,
    entity: string,
  ): Promise<Prisma.BatchPayload> {
    const deleted = await tx[entity].deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return deleted;
  }
}
