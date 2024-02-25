import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter } from 'nestjs-otel';
import {
  CreateSessionSerializer,
  RefreshSessionSerializer,
} from '../domain/entities/session.serializer';
import { SessionUseCase } from '../domain/usecase/session.usecase';
import { LoginSessionRequestBodyValidator } from '../domain/entities/session.validator';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import CookieAuthentication from '@/core/base/frameworks/shared/decorators/cookie-auth.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import { TCompactUser } from '@/core/base/domain/entities/auth.entity';
import User from '@/core/base/frameworks/shared/decorators/user.decorator';

@ApiTags('Session')
@OtelInstanceCounter()
@Controller('session')
export class SessionController {
  constructor(private readonly _sessionUseCase: SessionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serializer(CreateSessionSerializer)
  @CookieAuthentication('login')
  public async login(
    @Context() ctx: IContext,
    @Body() body: LoginSessionRequestBodyValidator,
  ): Promise<SuccessResponse> {
    const result = await this._sessionUseCase.login(ctx, {
      username: body.username,
      password: body.password,
    });

    return new SuccessResponse('login success!', result);
  }

  @ApiBearerAuth('access-token')
  @Get('ping')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'To Check status of authentication',
  })
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  public async pingAuth(): Promise<SuccessResponse> {
    return new SuccessResponse('token status ok!', true);
  }

  @ApiBearerAuth('access-token')
  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'To Get Information behind the scene of token',
  })
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  public async getMe(@User() user: TCompactUser): Promise<SuccessResponse> {
    return new SuccessResponse('success get information!', user);
  }

  @ApiBearerAuth('access-token')
  @Post('refresh')
  @HttpCode(HttpStatus.ACCEPTED)
  @Authentication(true)
  @Serializer(RefreshSessionSerializer)
  @CookieAuthentication('login')
  public async refresh(@Context() ctx: IContext): Promise<SuccessResponse> {
    const result = await this._sessionUseCase.refreshToken(ctx);

    return new SuccessResponse('token refreshed successfully', result);
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @CookieAuthentication('logout')
  public async logout(@User() user: TCompactUser): Promise<SuccessResponse> {
    if (user.id) await this._sessionUseCase.logout(user.id);
    return new SuccessResponse('logout success!', true);
  }
}
