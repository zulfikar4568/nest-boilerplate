import { TPrismaTx } from '../../domain/entities';

export class UpdateRepository<T extends Record<string, any>, B> {
  async update(id: string, body: B, tx: TPrismaTx, entity: string): Promise<T> {
    const data = await tx[entity].update({
      where: { id },
      data: body,
    });

    return data;
  }
}
