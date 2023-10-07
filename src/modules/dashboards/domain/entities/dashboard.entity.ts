import { Dashboard as TDashboard, Prisma } from '@prisma/client';
import { IListRequestQuery } from '../../../../core/base/domain/entities/query-cursor.entity';

export class Dashboard implements TDashboard {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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
