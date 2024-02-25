import { Module } from '@nestjs/common';
import { SessionModule } from './sessions/session.module';

@Module({
  imports: [SessionModule],
})
export class CoreModule {}
