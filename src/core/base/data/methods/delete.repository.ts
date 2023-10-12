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
}
