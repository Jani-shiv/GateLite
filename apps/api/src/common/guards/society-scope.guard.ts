import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SocietyScopeGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.membership) {
      throw new ForbiddenException('Access denied: No membership found');
    }

    const societyId = request.params.societyId || request.body.societyId || request.query.societyId;

    if (!societyId) {
      // If no societyId in params/body/query, use the user's membership society
      request.societyId = user.membership.societyId;
      return true;
    }

    // Verify the user belongs to this society
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId_flatId: {
          userId: user.id,
          societyId,
          flatId: user.membership.flatId,
        },
      },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new ForbiddenException('Access denied: Not a member of this society');
    }

    request.societyId = societyId;
    return true;
  }
}