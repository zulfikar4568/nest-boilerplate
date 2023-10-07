import { TPrismaTx } from '../../domain/entities';

export class DeleteRepository<T extends Record<string, any>> {
  async delete(id: string, tx: TPrismaTx, entity: string): Promise<T> {
    const data = await tx[entity].delete({
      where: { id },
    });

    return data;
  }
}
