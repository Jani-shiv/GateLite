import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { VisitsGateway } from './visits.gateway';
import { PushProvider } from '../common/interfaces/otp-provider.interface';
import { OtpProvider } from '../common/interfaces/otp-provider.interface';
import { VisitState, VisitorType } from '@prisma/client';

@Injectable()
export class VisitsService {
  private readonly escalationTimeoutSeconds = 30;

  constructor(
    private prisma: PrismaService,
    private visitsGateway: VisitsGateway,
    private pushProvider: PushProvider,
    private otpProvider: OtpProvider,
  ) {}

  async createWalkIn(societyId: string, guardId: string, data: {
    flatId: string;
    visitorName: string;
    visitorPhone?: string;
    purpose: string;
    visitorType: VisitorType;
    photoUrl?: string;
  }) {
    // Verify guard belongs to society
    const guardMembership = await this.prisma.membership.findFirst({
      where: { userId: guardId, societyId, role: 'GUARD', status: 'ACTIVE' },
    });
    if (!guardMembership) throw new ForbiddenException('Only guards can create walk-in visits');

    // Create or find visitor
    let visitor = await this.prisma.visitor.findFirst({
      where: { societyId, name: data.visitorName, phone: data.visitorPhone },
    });

    if (!visitor) {
      visitor = await this.prisma.visitor.create({
        data: {
          societyId,
          name: data.visitorName,
          phone: data.visitorPhone,
          photoUrl: data.photoUrl,
          type: data.visitorType,
        },
      });
    }

    // Create visit with PENDING state
    const visit = await this.prisma.visit.create({
      data: {
        societyId,
        flatId: data.flatId,
        visitorId: visitor.id,
        guardId,
        state: VisitState.PENDING,
        purpose: data.purpose,
      },
      include: { visitor: true, flat: true },
    });

    // Notify residents via WebSocket and push
    await this.notifyResidents(visit);

    // Start escalation timer
    this.startEscalationTimer(visit.id);

    return visit;
  }

  async createPreApproved(societyId: string, flatId: string, userId: string, data: {
    visitorName: string;
    visitorPhone?: string;
    validFrom: Date;
    validTo: Date;
    usesLeft: number;
    purpose?: string;
  }) {
    // Verify user owns the flat
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, flatId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('You can only create passes for your own flat');

    // Create or find visitor
    let visitor = await this.prisma.visitor.findFirst({
      where: { societyId, name: data.visitorName, phone: data.visitorPhone },
    });

    if (!visitor) {
      visitor = await this.prisma.visitor.create({
        data: {
          societyId,
          name: data.visitorName,
          phone: data.visitorPhone,
          type: VisitorType.VISITOR,
        },
      });
    }

    // Generate secure code
    const code = this.generateSecureCode();
    
    // Create pass
    const pass = await this.prisma.pass.create({
      data: {
        societyId,
        flatId,
        createdById: userId,
        visitorId: visitor.id,
        code,
        validFrom: data.validFrom,
        validTo: data.validTo,
        usesLeft: data.usesLeft,
      },
    });

    return { pass, code };
  }

  async verifyPass(societyId: string, code: string, guardId?: string) {
    const pass = await this.prisma.pass.findFirst({
      where: { code, societyId, isActive: true },
      include: { visitor: true, flat: true },
    });

    if (!pass) throw new NotFoundException('Invalid pass code');
    if (pass.validFrom > new Date()) throw new BadRequestException('Pass not yet valid');
    if (pass.validTo < new Date()) throw new BadRequestException('Pass expired');
    if (pass.usesLeft <= 0) throw new BadRequestException('Pass uses exhausted');

    // Decrement uses
    await this.prisma.pass.update({
      where: { id: pass.id },
      data: { usesLeft: { decrement: 1 } },
    });

    // Create visit with PRE_APPROVED state
    const visit = await this.prisma.visit.create({
      data: {
        societyId,
        flatId: pass.flatId,
        visitorId: pass.visitorId,
        passId: pass.id,
        guardId,
        state: VisitState.PRE_APPROVED,
        purpose: 'Pre-approved visit',
      },
      include: { visitor: true, flat: true, pass: true },
    });

    // Notify residents
    await this.notifyResidents(visit);

    return visit;
  }

  async approveVisit(societyId: string, visitId: string, userId: string, action: 'APPROVE' | 'DENY') {
    const visit = await this.prisma.visit.findFirst({
      where: { id: visitId, societyId },
      include: { flat: true, visitor: true, guard: true },
    });

    if (!visit) throw new NotFoundException('Visit not found');
    if (visit.state !== VisitState.PENDING && visit.state !== VisitState.PRE_APPROVED) {
      throw new BadRequestException('Visit cannot be approved/denied in current state');
    }

    // Verify user is a resident of the flat
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, flatId: visit.flatId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Only flat residents can approve/deny');

    const newState = action === 'APPROVE' ? VisitState.APPROVED : VisitState.DENIED;

    const updatedVisit = await this.prisma.visit.update({
      where: { id: visitId },
      data: { state: newState, approvedById: userId },
      include: { visitor: true, flat: true, guard: true },
    });

    // Notify guard via WebSocket
    if (visit.guardId) {
      this.visitsGateway.sendToUser(visit.guardId, 'visit:updated', updatedVisit);
    }

    // Send push to guard
    if (visit.guardId) {
      await this.sendPushToUser(visit.guardId, {
        title: action === 'APPROVE' ? 'Visit Approved' : 'Visit Denied',
        body: `${visit.visitor.name} for Flat ${visit.flat.number}`,
        data: { visitId: visit.id, state: newState },
      });
    }

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        societyId,
        actorId: userId,
        action: action === 'APPROVE' ? 'VISIT_APPROVE' : 'VISIT_DENY',
        entity: 'Visit',
        entityId: visitId,
      },
    });

    return updatedVisit;
  }

  async checkIn(societyId: string, visitId: string, guardId: string) {
    const visit = await this.prisma.visit.findFirst({
      where: { id: visitId, societyId },
    });

    if (!visit) throw new NotFoundException('Visit not found');
    if (visit.state !== VisitState.APPROVED && visit.state !== VisitState.PRE_APPROVED) {
      throw new BadRequestException('Visit must be approved before check-in');
    }

    return this.prisma.visit.update({
      where: { id: visitId },
      data: { state: VisitState.ENTERED, inAt: new Date(), guardId },
    });
  }

  async checkOut(societyId: string, visitId: string, guardId: string) {
    const visit = await this.prisma.visit.findFirst({
      where: { id: visitId, societyId },
    });

    if (!visit) throw new NotFoundException('Visit not found');
    if (visit.state !== VisitState.ENTERED) {
      throw new BadRequestException('Visitor must be checked in first');
    }

    return this.prisma.visit.update({
      where: { id: visitId },
      data: { state: VisitState.EXITED, outAt: new Date() },
    });
  }

  async getVisitHistory(societyId: string, userId: string, flatId?: string, params: { page?: number; limit?: number } = {}) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, societyId, status: 'ACTIVE' },
    });
    if (!membership) throw new ForbiddenException('Access denied');

    const targetFlatId = flatId || membership.flatId;
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where: { societyId, flatId: targetFlatId },
        include: { visitor: true, guard: { select: { id: true, name: true } }, approvedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.visit.count({ where: { societyId, flatId: targetFlatId } }),
    ]);

    return { visits, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPendingVisits(societyId: string, guardId: string) {
    const guardMembership = await this.prisma.membership.findFirst({
      where: { userId: guardId, societyId, role: 'GUARD', status: 'ACTIVE' },
    });
    if (!guardMembership) throw new ForbiddenException('Guard access required');

    return this.prisma.visit.findMany({
      where: { societyId, state: { in: [VisitState.PENDING, VisitState.PRE_APPROVED] } },
      include: { visitor: true, flat: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async notifyResidents(visit: any) {
    // Get all residents of the flat
    const memberships = await this.prisma.membership.findMany({
      where: { societyId: visit.societyId, flatId: visit.flatId, status: 'ACTIVE' },
      include: { user: { include: { devices: true } } },
    });

    for (const membership of memberships) {
      // Send WebSocket notification
      this.visitsGateway.sendToUser(membership.userId, 'visit:pending', {
        visitId: visit.id,
        visitorName: visit.visitor.name,
        visitorPhoto: visit.visitor.photoUrl,
        purpose: visit.purpose,
        state: visit.state,
        createdAt: visit.createdAt,
      });

      // Send push notifications
      for (const device of membership.user.devices) {
        await this.sendPushToUser(membership.userId, {
          title: 'New Visitor',
          body: `${visit.visitor.name} is at the gate`,
          data: { visitId: visit.id, state: visit.state },
        }, device.fcmToken);
      }
    }
  }

  private startEscalationTimer(visitId: string) {
    setTimeout(async () => {
      const visit = await this.prisma.visit.findUnique({ where: { id: visitId } });
      if (visit && visit.state === VisitState.PENDING) {
        // Escalate to other flat members
        await this.escalateVisit(visitId);
      }
    }, this.escalationTimeoutSeconds * 1000);
  }

  private async escalateVisit(visitId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id: visitId },
      include: { flat: { include: { memberships: { where: { status: 'ACTIVE' }, include: { user: true } } } } },
    });

    if (!visit || visit.state !== VisitState.PENDING) return;

    // Notify all other flat members
    for (const membership of visit.flat.memberships) {
      if (membership.userId !== visit.approvedById) {
        this.visitsGateway.sendToUser(membership.userId, 'visit:escalated', {
          visitId: visit.id,
          visitorName: visit.visitor.name,
          message: 'No response from primary resident. Please respond.',
        });
      }
    }

    // If still no response after another timeout, apply guard policy
    setTimeout(async () => {
      const updatedVisit = await this.prisma.visit.findUnique({ where: { id: visitId } });
      if (updatedVisit && updatedVisit.state === VisitState.PENDING) {
        // Get society policy
        const society = await this.prisma.society.findUnique({ where: { id: updatedVisit.societyId } });
        const policy = (society?.settings as any)?.escalationPolicy || 'HOLD';
        
        let finalState: VisitState;
        if (policy === 'ALLOW') finalState = VisitState.APPROVED;
        else if (policy === 'DENY') finalState = VisitState.DENIED;
        else finalState = VisitState.TIMED_OUT;

        await this.prisma.visit.update({
          where: { id: visitId },
          data: { state: finalState },
        });

        // Notify guard
        if (updatedVisit.guardId) {
          this.visitsGateway.sendToUser(updatedVisit.guardId, 'visit:updated', {
            ...updatedVisit,
            state: finalState,
          });
        }
      }
    }, this.escalationTimeoutSeconds * 1000);
  }

  private generateSecureCode(): string {
    // Generate HMAC-signed code for offline verification
    const payload = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return require('crypto').createHmac('sha256', process.env.PASS_SIGNING_KEY || 'dev-key')
      .update(payload)
      .digest('hex')
      .substr(0, 8)
      .toUpperCase();
  }

  private async sendPushToUser(userId: string, payload: any, token?: string) {
    if (token) {
      await this.pushProvider.sendPush(token, payload);
    } else {
      const devices = await this.prisma.device.findMany({ where: { userId } });
      for (const device of devices) {
        await this.pushProvider.sendPush(device.fcmToken, payload);
      }
    }
  }
}