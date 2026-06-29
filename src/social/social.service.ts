import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialService {
  private readonly logger = new Logger(SocialService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStockDiscussionThreads(ticker: string) {
    const threads = await this.prisma.discussionThread.findMany({
      where: { ticker },
      include: {
        posts: {
          include: { user: { select: { id: true, profile: { select: { displayName: true } } } } },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return threads;
  }

  async createThread(ticker: string, userId: string, title: string) {
    return this.prisma.discussionThread.create({
      data: { ticker, title },
    });
  }

  async postToThread(threadId: string, userId: string, content: string) {
    const thread = await this.prisma.discussionThread.findUnique({
      where: { id: threadId },
    });
    if (!thread) throw new NotFoundException('Thread not found');

    return this.prisma.discussionPost.create({
      data: { threadId, userId, content },
    });
  }

  async upvotePost(postId: string) {
    return this.prisma.discussionPost.update({
      where: { id: postId },
      data: { upvotes: { increment: 1 } },
    });
  }
}
