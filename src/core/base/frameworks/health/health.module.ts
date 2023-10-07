import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import PrismaService from '../data-services/prisma/prisma.service';
import HealthController from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export default class HealthModule {}
