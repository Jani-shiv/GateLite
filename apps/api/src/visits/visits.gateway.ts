import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/visits',
})
export class VisitsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private socketUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      // Verify user exists and is active
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.status !== 'ACTIVE') {
        client.disconnect();
        return;
      }

      // Store connection
      client.data.userId = payload.sub;
      client.data.societyId = payload.societyId;
      client.data.flatId = payload.flatId;

      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set());
      }
      this.userSockets.get(payload.sub)!.add(client.id);
      this.socketUsers.set(client.id, payload.sub);

      // Join flat room for real-time updates
      if (payload.flatId) {
        client.join(`flat:${payload.flatId}`);
      }

      // Join society room for guards/admins
      if (payload.societyId) {
        client.join(`society:${payload.societyId}`);
        if (payload.role === 'GUARD' || payload.role === 'ADMIN') {
          client.join(`guards:${payload.societyId}`);
        }
      }

      console.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.socketUsers.delete(client.id);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinFlat')
  handleJoinFlat(@ConnectedSocket() client: Socket, @MessageBody() flatId: string) {
    if (client.data.flatId === flatId) {
      client.join(`flat:${flatId}`);
      return { success: true };
    }
    return { success: false, error: 'Not authorized for this flat' };
  }

  @SubscribeMessage('joinSociety')
  handleJoinSociety(@ConnectedSocket() client: Socket, @MessageBody() societyId: string) {
    if (client.data.societyId === societyId) {
      client.join(`society:${societyId}`);
      return { success: true };
    }
    return { success: false, error: 'Not authorized for this society' };
  }

  // Helper methods for services to send events
  sendToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      for (const socketId of sockets) {
        this.server.to(socketId).emit(event, data);
      }
    }
  }

  sendToFlat(flatId: string, event: string, data: any) {
    this.server.to(`flat:${flatId}`).emit(event, data);
  }

  sendToSociety(societyId: string, event: string, data: any) {
    this.server.to(`society:${societyId}`).emit(event, data);
  }

  sendToGuards(societyId: string, event: string, data: any) {
    this.server.to(`guards:${societyId}`).emit(event, data);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  getUserSocketCount(userId: string): number {
    return this.userSockets.get(userId)?.size || 0;
  }
}