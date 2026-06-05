import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(
    @CurrentUser() user: { supabaseAuthId: string; email: string; role: string },
  ) {
    return this.userService.getProfile(user.email);
  }
}
