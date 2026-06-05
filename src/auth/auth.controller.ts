import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/sync
   * Protected route — requires a valid Supabase JWT.
   * Syncs the authenticated user with the local database.
   */
  @Post('sync')
  async syncUser(
    @CurrentUser() user: { supabaseAuthId: string; email: string; role: string },
    @Body() body: { displayName?: string },
  ) {
    return this.authService.syncUser(
      user.supabaseAuthId,
      user.email,
      body.displayName,
    );
  }
}
