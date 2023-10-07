import { Module } from '@nestjs/common';
import { PostgresDataModule } from '../../frameworks/data-services';

@Module({
  imports: [PostgresDataModule],
  exports: [PostgresDataModule],
})
export class DataServiceModule {}
