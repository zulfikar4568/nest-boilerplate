import { TPrismaTx } from '../../domain/entities';

export class CreateRepository {
  static async create<T extends Record<string, any>, B>(
    body: B,
    tx: TPrismaTx,
    entity: string,
  ): Promise<T> {
    const data = await tx[entity].create({
      data: body,
    });

    return data;
  }
}
