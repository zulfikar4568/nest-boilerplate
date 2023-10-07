import { Dashboard as TDashboard, Prisma } from '@prisma/client';
import { IListRequestQuery } from '../../../../core/base/domain/entities/query-cursor.entity';
import { BaseEntity } from '@/core/base/domain/entities';

export class Dashboard extends BaseEntity implements TDashboard {}

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
