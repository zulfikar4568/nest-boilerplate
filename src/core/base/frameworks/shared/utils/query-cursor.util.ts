import {
  ESortMode,
  IListRequestQuery,
  IListCursorRequest,
} from '../../../domain/entities';

export const parseQueryCursor = <T>(
  query: T & IListRequestQuery<IListCursorRequest>,
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
