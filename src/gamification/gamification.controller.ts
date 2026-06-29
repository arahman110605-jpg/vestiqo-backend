import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('missions')
  async getMissions(@Req() req) {
    return this.gamificationService.getDailyMissions(req.user.id);
  }

  @Post('mission/:id/complete')
  async completeMission(@Req() req, @Param('id') missionId: string) {
    return this.gamificationService.completeMission(req.user.id, missionId);
  }

  @Get('challenges')
  async getChallenges() {
    return this.gamificationService.fetchActiveChallenges();
  }
}
