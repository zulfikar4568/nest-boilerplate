import { Module } from '@nestjs/common';
import { UserRepository } from './data/user.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Module({
  providers: [UserRepository, PrismaService],
  exports: [UserRepository],
})
export class UserModule {}
