import { Module } from '@nestjs/common';
import { UserRepository } from '../../../modules/users/data/user.repository';
import { SessionRepository } from './data/session.repository';
import { SessionController } from './infrastructure/session.controller';
import { SessionUseCase } from './domain/usecase/session.usecase';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Module({
  providers: [SessionRepository, UserRepository, PrismaService, SessionUseCase],
  exports: [SessionRepository],
  controllers: [SessionController],
})
export class SessionModule {}
