import {
  ESortMode,
  IListRequestQuery,
  IListPaginationRequest,
} from '@/core/base/domain/entities';

export const parsePaginationQuery = <T>(
  query: T & IListRequestQuery<IListPaginationRequest>,
): {
  limit: number;
  offset: number;
  order: { [key: string]: ESortMode };
  page: number;
} => {
  const limit = query.filters.pagination?.limit || 25;
  const page = query.filters.pagination?.page || 1;

  const offset = limit * (page - 1);
  const order = {
    [query.filters.sort?.by || 'createdAt']:
      query.filters.sort?.mode || ESortMode.DESC,
  };

  return {
    limit: Number(limit),
    offset: Number(offset),
    order,
    page: Number(page),
  };
};

export const parsePaginationMeta = <T>({
  result,
  total,
  limit,
  page,
}: {
  result: T[];
  total: number;
  limit: number;
  page: number;
}) => ({
  count: result.length,
  total,
  page,
  totalPage: Math.ceil(total / limit),
});
