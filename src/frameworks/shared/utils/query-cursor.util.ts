import { ESortMode, IListRequestQuery } from '../../../core/entities';

export const parseQueryCursor = <T>(
  query: T & IListRequestQuery,
): {
  limit: number;
  cursor: string | undefined;
  order: { [key: string]: ESortMode };
} => {
  const limit = query.filters.pagination?.limit || 25;
  const cursor = query.filters.pagination?.cursor || undefined;
  const order = {
    [query.filters.sort?.by || 'createdAt']:
      query.filters.sort?.mode || ESortMode.DESC,
  };

  return {
    limit: Number(limit),
    cursor,
    order,
  };
};
