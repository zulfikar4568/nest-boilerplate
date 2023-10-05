import { Dashboard, Prisma } from '@prisma/client';
import { IListRequestQuery } from './query-cursor.entity';

export type OptionalDashboard = Partial<Dashboard>;
export type RequiredDashboard = Required<Dashboard>;
export type TListDashboardRequestQuery = IListRequestQuery<
  Dashboard,
  Prisma.DashboardWhereInput
>;
export type TGetDashboardByIdRequestParams = Pick<Dashboard, 'id'>;
export type TUpdateDashboardByIdRequestParams = Pick<Dashboard, 'id'>;
export type TDeleteDashboardByIdRequestParams = Pick<Dashboard, 'id'>;
export type TCreateDashboardRequestBody = Omit<
  Dashboard,
  'id' | 'createdAt' | 'updatedAt'
>;
export type TUpdateDashboardRequestBody = Partial<TCreateDashboardRequestBody>;
