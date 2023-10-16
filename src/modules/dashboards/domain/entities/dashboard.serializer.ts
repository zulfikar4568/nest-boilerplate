import { Dashboard } from '@prisma/client';

export class ListDashboardSerializer implements Dashboard {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}

export class CreateDashboardSerializer implements Dashboard {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}

export class UpdateDashboardSerializer extends CreateDashboardSerializer {}
export class DeleteDashboardSerializer extends CreateDashboardSerializer {}
export class GetDashboardSerializer extends CreateDashboardSerializer {}
