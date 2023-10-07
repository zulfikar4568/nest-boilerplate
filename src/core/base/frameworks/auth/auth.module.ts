import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './auth.strategy';
import appConfig from '@/config/app.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: appConfig.JWT_SECRET,
      signOptions: { expiresIn: appConfig.JWT_EXPIRES_IN },
    }),
  ],
  providers: [AuthStrategy],
})
export default class AuthModule {}
