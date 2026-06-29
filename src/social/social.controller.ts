import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { SocialService } from './social.service';
import { Public } from '../auth/public.decorator';

class CreateThreadDto {
  ticker: string;
  title: string;
}

class CreatePostDto {
  threadId: string;
  content: string;
}

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Public()
  @Get(':ticker/threads')
  async getThreads(@Param('ticker') ticker: string) {
    return this.socialService.getStockDiscussionThreads(ticker);
  }

  @Post('threads')
  async createThread(@Req() req, @Body() dto: CreateThreadDto) {
    return this.socialService.createThread(dto.ticker, req.user.id, dto.title);
  }

  @Post('posts')
  async createPost(@Req() req, @Body() dto: CreatePostDto) {
    return this.socialService.postToThread(dto.threadId, req.user.id, dto.content);
  }

  @Post('posts/:id/upvote')
  async upvotePost(@Param('id') postId: string) {
    return this.socialService.upvotePost(postId);
  }
}
