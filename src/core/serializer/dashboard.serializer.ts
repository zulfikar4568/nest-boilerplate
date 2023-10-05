import { Dashboard } from '@prisma/client';

export class CreateDashboardSerializer implements Dashboard {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  name: string;
}

export class UpdateDashboardSerializer extends CreateDashboardSerializer {}
export class DeleteDashboardSerializer extends CreateDashboardSerializer {}
