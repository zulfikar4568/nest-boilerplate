import { TPrismaTx } from '../../domain/entities';

export class CreateRepository<T extends Record<string, any>, B> {
  async create(body: B, tx: TPrismaTx, entity: string): Promise<T> {
    const data = await tx[entity].create({
      data: body,
    });

    return data;
  }
}
