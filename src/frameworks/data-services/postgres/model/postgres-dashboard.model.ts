import { Dashboard } from 'src/core/entities';
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
    console.log(id);
    return item;
  }

  private async queryInsert(item: Dashboard) {
    // INSERT INTO Tbl.Dashboard (name, description) VALUE ({item.name}, {item.description})
    return item;
  }

  private async queryById(id: string) {
    // SELECT * FROM Tbl.Dashboard where id = {id}
    console.log(id);
    const dashboard = new Dashboard();
    dashboard.name = 'Dashboard A';
    dashboard.description = 'Dasboard Jakarta';

    return dashboard;
  }

  private async queryAll() {
    // SELECT * FROM Tbl.Dashboard
    const dashboards: Dashboard[] = [];
    dashboards.push(
      {
        name: 'Dashboard A',
        description: 'Dasboard Jakarta',
      },
      {
        name: 'Dashboard B',
        description: 'Dasboard Bandung',
      },
    );

    return dashboards;
  }
}
