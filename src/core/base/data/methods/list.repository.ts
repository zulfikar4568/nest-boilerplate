import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import { parseQueryCursor } from '../../frameworks/shared/utils/query-cursor.util';
import {
  IListCursorResult,
  IListPaginationResult,
  TPrismaTx,
} from '../../domain/entities';
import {
  parsePaginationMeta,
  parsePaginationQuery,
} from '../../frameworks/shared/utils/query-pagination.util';

export class ListRepository {
  static async listDropDown<Entity extends Record<string, any>>(
    tx: TPrismaTx,
    entity: string,
  ): Promise<Pick<Entity, 'id' | 'name'>[]> {
    const data = await tx[entity].findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return data;
  }

  static async listPagination<
    Entity extends Record<string, any>,
    Include extends Record<string, any>,
    Where extends Record<string, any>,
  >(
    ctx: IContext,
    tx: TPrismaTx,
    entity: string,
    include?: Include,
    where?: Where,
  ): Promise<IListPaginationResult<Entity>> {
    const query = ctx.params.query as any;

    const { limit, offset, order, page } = parsePaginationQuery<any>(query);

    const selectOptions = {
      orderBy: order,
      where: {
        ...query.filters.field,
        ...where,
      },
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const queryData = await ListRepository.queryData<Entity>(
      selectOptions,
      { ...selectOptions, ...{ include }, ...pageOptions },
      tx,
      entity,
    );

    const meta = parsePaginationMeta<Entity>({
      result: queryData.data,
      total: queryData.total,
      page,
      limit,
    });

    return {
      result: queryData.data,
      meta,
    };
  }

  static async listCursor<
    Entity extends Record<string, any>,
    Include extends Record<string, any>,
    Where extends Record<string, any>,
  >(
    ctx: IContext,
    tx: TPrismaTx,
    entity: string,
    include?: Include,
    where?: Where,
  ): Promise<IListCursorResult<Entity>> {
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
