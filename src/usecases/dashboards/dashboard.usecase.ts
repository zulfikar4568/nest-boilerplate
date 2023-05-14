import { Injectable } from '@nestjs/common';
import { IAuditServices, IDataServices } from 'src/core/abstracts';
import { Dashboard } from 'src/core/entities';

@Injectable()
export class DashboardUseCase {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly auditServices: IAuditServices<Dashboard>,
  ) {}

  async getAllDashboards(): Promise<Dashboard[]> {
    return this.dataServices.dashboards.getAll();
  }

  async getDashboardById(id: any): Promise<Dashboard> {
    return this.dataServices.dashboards.get(id);
  }

  async createDashboard(dashboard: Dashboard): Promise<Dashboard> {
    try {
      // Nanti kita lakukan logic disini
      // Seperti:
      // Logic logic bisnis akan di lakukan di sini
      // Seperti Perhitungan Kalkukasi kita lakukan di sini
      /**
       * Contoh:
       * - Business rules validation.
       * - Check that the dashboard doesn’t exist in DB.
       * - Create a new dashboard object.
       * - Persist our new dashboard in DB.
       * - Update the Audit System
       */
      const createDashboard = await this.dataServices.dashboards.create(
        dashboard,
      );

      // Setelah selesai kirim ke dashboard, kirim ke notifikasi ke audit
      await this.auditServices.addHistoryAudit(dashboard);

      return createDashboard;
    } catch (error) {
      throw error;
    }
  }

  async updateDashboard(
    dashboardId: string,
    dashboard: Dashboard,
  ): Promise<Dashboard> {
    const dashboardUpdated = this.dataServices.dashboards.update(
      dashboardId,
      dashboard,
    );
    // Setelah selesai kirim ke dashboard, kirim ke notifikasi ke audit
    await this.auditServices.addHistoryAudit(dashboard);
    return dashboardUpdated;
  }
}
