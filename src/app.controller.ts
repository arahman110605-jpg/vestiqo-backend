import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { PrismaService } from './prisma/prisma.service';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './redis/redis.module';
import { createClient } from 'redis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: ReturnType<typeof createClient> | null,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  async health() {
    const checks: Record<string, string> = {};

    // DB check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch {
      checks.database = 'error';
    }

    // Redis check
    if (this.redis) {
      try {
        await this.redis.ping();
        checks.redis = 'ok';
      } catch {
        checks.redis = 'error';
      }
    } else {
      checks.redis = 'not_configured';
    }

    const allOk = Object.values(checks).every((v) => v === 'ok' || v === 'not_configured');
    return {
      status: allOk ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
