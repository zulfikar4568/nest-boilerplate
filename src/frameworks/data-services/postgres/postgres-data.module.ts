import { Module } from '@nestjs/common';
import { PostgresDashboardModel } from './model';
import { IDataServices } from 'src/core/abstracts';
import { PostgresDataService } from './postgres-data.service';

@Module({
  imports: [],
  providers: [
    PostgresDashboardModel,
    {
      provide: IDataServices,
      useClass: PostgresDataService,
    },
  ],
  exports: [IDataServices],
})
export class PostgresDataModule {}
