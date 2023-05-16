import { Dashboard } from '../../../../core/entities';
import { IPostgresGenericModel } from './postgres-generic.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresDashboardModel extends IPostgresGenericModel<Dashboard> {
  findAll(): Promise<Dashboard[]> {
    return this.queryAll();
  }
  findById(id: string): Promise<Dashboard> {
    return this.queryById(id);
  }

  create(item: Dashboard): Promise<Dashboard> {
    return this.queryInsert(item);
  }
  update(id: string, item: Dashboard): Promise<Dashboard> {
    return this.queryUpdate(id, item);
  }

  // ******************* Do some query in here **********************
  private async queryUpdate(id: string, item: Dashboard) {
    // UPDATE Tbl.Dashboard SET name = {item.name}, {item.description} where id = {id}
    return {
      id,
      ...item,
    };
  }

  private async queryInsert(item: Dashboard) {
    // INSERT INTO Tbl.Dashboard (name, description) VALUE ({item.name}, {item.description})
    const id = '1';
    return {
      id,
      ...item,
    };
  }

  private async queryById(id: string) {
    // SELECT * FROM Tbl.Dashboard where id = {id}
    const dashboard = new Dashboard();
    dashboard.id = id;
    dashboard.name = 'Dashboard A';
    dashboard.description = 'Dasboard Jakarta';

    return dashboard;
  }

  private async queryAll() {
    // SELECT * FROM Tbl.Dashboard
    const dashboards: Dashboard[] = [];
    dashboards.push(
      {
        id: '1',
        name: 'Dashboard A',
        description: 'Dasboard Jakarta',
      },
      {
        id: '2',
        name: 'Dashboard B',
        description: 'Dasboard Bandung',
      },
    );

    return dashboards;
  }
}
