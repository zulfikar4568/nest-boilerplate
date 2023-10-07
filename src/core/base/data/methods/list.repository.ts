import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import { parseQueryCursor } from '../../frameworks/shared/utils/query-cursor.util';
import { IListResult, TPrismaTx } from '../../domain/entities';

export class ListRepository<T extends Record<string, any>> {
  async listDropDown(
    tx: TPrismaTx,
    entity: string,
  ): Promise<Pick<T, 'id' | 'name'>[]> {
    const data = await tx[entity].findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return data;
  }

  async list(
    ctx: IContext,
    tx: TPrismaTx,
    entity: string,
  ): Promise<IListResult<T>> {
    const query = ctx.params.query as any;

    const { limit, order, cursor } = parseQueryCursor<any>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    let pageOptions = {
      take: limit,
    };

    if (cursor !== undefined && cursor !== '') {
      await tx[entity].findUnique({
        where: {
          id: cursor,
        },
      });

      pageOptions = {
        ...pageOptions,
        ...{ cursor: { id: cursor }, skip: 1 },
      };
    }

    const queryData = await this.queryData(
      { ...pageOptions, ...selectOptions },
      selectOptions,
      tx,
      entity,
    );

    const lastCursor =
      queryData.data.length > 0
        ? queryData.data[queryData.data.length - 1].id
        : '';

    return {
      result: queryData.data,
      meta: {
        lastCursor: lastCursor,
        total: queryData.total,
      },
    };
  }

  private async queryData(
    totalArgs: any,
    findArgs: any,
    tx: TPrismaTx,
    entity: string,
  ): Promise<{
    total: number;
    data: T[];
  }> {
    const total = await tx[entity].count(totalArgs);
    const data = await tx[entity].findMany(findArgs);

    return {
      total,
      data,
    };
  }
}
