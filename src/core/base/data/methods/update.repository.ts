import { TPrismaTx } from '../../domain/entities';

export class UpdateRepository {
  static async update<T extends Record<string, any>, B>(
    id: string,
    body: B,
    tx: TPrismaTx,
    entity: string,
  ): Promise<T> {
    const data = await tx[entity].update({
      where: { id },
      data: body,
    });

    return data;
  }
}
