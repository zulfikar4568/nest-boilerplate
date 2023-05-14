import { Module } from '@nestjs/common';
import { PostgresDataModule } from 'src/frameworks/data-services/postgres';

@Module({
  imports: [PostgresDataModule],
  exports: [PostgresDataModule],
})
export class DataServiceModule {}
