import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import { parseQueryCursor } from '../../frameworks/shared/utils/query-cursor.util';
import { IListResult, TPrismaTx } from '../../domain/entities';

export class ListRepository {
  static async listDropDown<Entity extends Record<string, any>>(
    tx: TPrismaTx,
    entity: string,
  ): Promise<Pick<Entity, 'id' | 'name'>[]> {
    const data = await tx[entity].findMany({
      select: {
        id: true,
        nama: true,
      },
    });

    return data;
  }

  static async list<
    Entity extends Record<string, any>,
    Include extends Record<string, any>,
    Where extends Record<string, any>,
  >(
    ctx: IContext,
    tx: TPrismaTx,
    entity: string,
    include?: Include,
    where?: Where,
  ): Promise<IListResult<Entity>> {
    const query = ctx.params.query as any;

    const { limit, order, cursor } = parseQueryCursor<any>(query);

    const selectOptions = {
      orderBy: order,
      where: {
        ...query.filters.field,
        ...where,
      },
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

    const queryData = await ListRepository.queryData<Entity>(
      selectOptions,
      { ...selectOptions, ...{ include }, ...pageOptions },
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

  private static async queryData<Entity extends Record<string, any>>(
    totalArgs: any,
    findArgs: any,
    tx: TPrismaTx,
    entity: string,
  ): Promise<{
    total: number;
    data: Entity[];
  }> {
    const total = await tx[entity].count(totalArgs);
    const data = await tx[entity].findMany(findArgs);

    return {
      total,
      data,
    };
  }
}
