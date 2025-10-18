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
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws/leaderboard',
})
export class LeaderboardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('LeaderboardGateway');
  private clients: Map<string, Set<Socket>> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Send welcome message
    client.emit('connected', {
      type: 'connected',
      message: 'Connected to leaderboard updates',
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Remove from all rooms
    this.clients.forEach((sockets, competitionId) => {
      sockets.delete(client);
      if (sockets.size === 0) {
        this.clients.delete(competitionId);
      }
    });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { competition_id: string },
  ) {
    const { competition_id } = data;
    
    if (!competition_id) {
      client.emit('error', { message: 'Competition ID is required' });
      return;
    }

    // Join room
    client.join(competition_id);
    
    // Track client
    if (!this.clients.has(competition_id)) {
      this.clients.set(competition_id, new Set());
    }
    this.clients.get(competition_id).add(client);

    this.logger.log(`Client ${client.id} subscribed to ${competition_id}`);
    
    client.emit('subscribed', {
      type: 'subscribed',
      competition_id,
      message: `Subscribed to competition ${competition_id}`,
    });
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { competition_id: string },
  ) {
    const { competition_id } = data;
    
    if (!competition_id) {
      return;
    }

    // Leave room
    client.leave(competition_id);
    
    // Remove from tracking
    if (this.clients.has(competition_id)) {
      this.clients.get(competition_id).delete(client);
      if (this.clients.get(competition_id).size === 0) {
        this.clients.delete(competition_id);
      }
    }

    this.logger.log(`Client ${client.id} unsubscribed from ${competition_id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', {
      type: 'pong',
      timestamp: new Date().toISOString(),
    });
  }

  // Method to broadcast leaderboard updates
  broadcastLeaderboardUpdate(competitionId: string, data: any) {
    this.server.to(competitionId).emit('leaderboard_update', {
      type: 'leaderboard_update',
      competition_id: competitionId,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Method to broadcast score updates
  broadcastScoreUpdate(
    competitionId: string,
    userId: string,
    score: number,
  ) {
    this.server.to(competitionId).emit('score_update', {
      type: 'score_update',
      competition_id: competitionId,
      user_id: userId,
      score,
      timestamp: new Date().toISOString(),
    });
  }
}
