import { Module } from '@nestjs/common';
import { IDataServices } from '../../../core/abstracts';
import { PostgresDataService } from './postgres-data.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: IDataServices,
      useClass: PostgresDataService,
    },
  ],
  exports: [IDataServices],
})
export class PostgresDataModule {}
