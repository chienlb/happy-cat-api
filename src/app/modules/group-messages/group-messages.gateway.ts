import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

const logger = new Logger('GroupMessagesGateway');

@WebSocketGateway({
  namespace: 'group-messages',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class GroupMessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect();
      return;
    }
    client.join(userId);
    logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-group')
  handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() groupId: string,
  ) {
    client.join(groupId);
    logger.log(`Client joined group: ${groupId}`);
  }

  emitNewMessage(groupId: string, message: any) {
    this.server.to(`group:${groupId}`).emit('group:message:new', message);
    logger.log(`New message emitted for group: ${groupId}`);
  }

  emitEditMessage(groupId: string, message: any) {
    this.server.to(`group:${groupId}`).emit('group:message:edit', message);
    logger.log(
      `Edit message emitted for message: ${message.id} to group: ${groupId}`,
    );
  }

  emitDeleteMessage(groupId: string, messageId: string) {
    this.server.to(`group:${groupId}`).emit('group:message:delete', {
      messageId,
    });
    logger.log(
      `Delete message emitted for message: ${messageId} to group: ${groupId}`,
    );
  }

  emitReadReceipt(groupId: string, messageId: string, userId: string) {
    this.server.to(`group:${groupId}`).emit('group:message:read', {
      messageId,
      userId,
    });
    logger.log(
      `Read receipt emitted for message: ${messageId} to user: ${userId}`,
    );
  }
}
