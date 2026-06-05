import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class B2bService {
  private readonly logger = new Logger(B2bService.name);

  async createOrganization(name: string) {
    this.logger.log(`Creating B2B Organization: ${name}`);
    return prisma.organization.create({ data: { name } });
  }

  async provisionStudentAccounts(organizationId: string, classroomName: string, studentEmails: string[]) {
    this.logger.log(`Provisioning ${studentEmails.length} accounts for ${classroomName}`);
    // Logic to batch create users and link them to Classroom
    return { success: true, accountsCreated: studentEmails.length };
  }
}
