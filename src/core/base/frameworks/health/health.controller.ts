import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@ApiTags('Health')
@Controller()
export default class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Version(VERSION_NEUTRAL)
  @Get('health')
  @ApiOperation({
    summary: 'This method is to check health of the application',
  })
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  check() {
    return this.healthCheck();
  }

  @Version(VERSION_NEUTRAL)
  @Get()
  @ApiOperation({
    summary: 'This method is to check health of the application',
  })
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  check2() {
    return this.healthCheck();
  }

  private async healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.prismaHealth.pingCheck('prisma-database', this.prisma, {
          timeout: 3000,
        }),
    ]);
  }
}
