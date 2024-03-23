import { Cache } from 'cache-manager';
import { NotFoundException } from '../../frameworks/shared/exceptions/common.exception';
import {
  IListCursorResult,
  IListPaginationResult,
  TPrismaTx,
} from '../../domain/entities';
import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import {
  parsePaginationMeta,
  parsePaginationQuery,
} from '../../frameworks/shared/utils/query-pagination.util';
import { parseQueryCursor } from '../../frameworks/shared/utils/query-cursor.util';

export class ReadHelper {
  static async getMany<Entity, Include, Select, Where>(
    tx: TPrismaTx,
    entity: string,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity[]> {
    const data = await tx[entity].findMany({
      where,
      select,
      include,
    });

    return data;
  }
  static async getById<Entity, Include, Select>(
    id: string,
    tx: TPrismaTx,
    entity: string,
    cacheManager: Cache,
    include?: Include,
    select?: Select,
  ): Promise<Entity> {
    const value = await cacheManager.get(id);

    if (!value) {
      const data = await tx[entity].findUnique({
        where: {
          id,
        },
        include,
        select,
      });

      if (!data) {
        throw new NotFoundException({
          message: `${entity} dengan id ${id} tidak ditemukan!`,
        });
      }

      await cacheManager.set(id, data);
      return data;
    }

    return value as Entity;
  }
  static async get<Entity, Include, Select, Where>(
    tx: TPrismaTx,
    entity: string,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    const data = await tx[entity].findUnique({
      where,
      include,
      select,
    });

    return data;
  }

  static async listDropDown<Entity extends Record<string, any>>(
    ctx: IContext,
    tx: TPrismaTx,
    entity: string,
  ): Promise<Pick<Entity, 'id' | 'name'>[]> {
    const query = ctx.params.query as any;

    const data = await tx[entity].findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        name: {
          contains: query.search,
        },
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

    const queryData = await ReadHelper.queryData<Entity>(
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

    const queryData = await ReadHelper.queryData<Entity>(
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
