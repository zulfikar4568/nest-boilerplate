import { Module } from '@nestjs/common';
import { UserRepository } from './data/user.repository';
import { UserController } from './infrastructure/user.controller';
import { UserUseCase } from './domain/usecase/user.usecase';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Module({
  providers: [UserRepository, PrismaService, UserUseCase],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
