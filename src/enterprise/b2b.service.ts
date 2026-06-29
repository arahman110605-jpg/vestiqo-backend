import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class B2bService {
  private readonly logger = new Logger(B2bService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(name: string) {
    return this.prisma.organization.create({ data: { name } });
  }

  async createClassroom(organizationId: string, name: string) {
    return this.prisma.classroom.create({
      data: { organizationId, name },
    });
  }

  async provisionStudentAccounts(classroomId: string, studentEmails: string[]) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
      include: { organization: true },
    });
    if (!classroom) throw new Error('Classroom not found');

    let created = 0;
    for (const email of studentEmails) {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) continue;

      const user = await this.prisma.user.create({
        data: {
          email,
          supabaseAuthId: `b2b-${classroomId}-${email}`,
          profile: {
            create: {
              displayName: email.split('@')[0],
              experienceLevel: 'Beginner',
            },
          },
        },
      });

      await this.prisma.student.create({
        data: { userId: user.id, classroomId },
      });
      created++;
    }

    return { success: true, accountsCreated: created, classroomName: classroom.name };
  }

  async getOrganizationAnalytics(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        classrooms: {
          include: {
            students: {
              include: {
                user: {
                  include: {
                    profile: { select: { xp: true, level: true, learningStreak: true } },
                    quizAttempts: { where: { passed: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!org) throw new Error('Organization not found');

    const totalStudents = org.classrooms.reduce((sum, c) => sum + c.students.length, 0);
    const totalCompletedLessons = org.classrooms.reduce(
      (sum, c) => sum + c.students.reduce((s, st) => s + st.user.quizAttempts.length, 0),
      0,
    );

    return {
      organizationName: org.name,
      totalClassrooms: org.classrooms.length,
      totalStudents,
      totalCompletedLessons,
      avgXp: totalStudents > 0
        ? org.classrooms.reduce((sum, c) => sum + c.students.reduce((s, st) => s + (st.user.profile?.xp ?? 0), 0), 0) / totalStudents
        : 0,
    };
  }
}
