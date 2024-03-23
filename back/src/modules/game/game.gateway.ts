import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Game } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import GameService from './game.service';
import CreateGameDto from './dto/create-game.dto';
import MakeMoveDto from './dto/make-move.dto';

@WebSocketGateway(80,{ transports: ['websocket'], cors: true})
@Injectable()
export default class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly gameService: GameService) {}
  handleConnection(client: any, ...args: any[]) {
    const userId = client.handshake.auth.userId;
    for (const game of this.games) {
      if (game.player1 === userId || game.player2 === userId) {
        client.join(game.id);
        console.log('joined', userId);
      }
    }
    client.join(userId);
    this.connectedClients.push(userId);
    console.log('connected', userId);
    this.server.to(userId).emit('connected', 'connected');
  }
  handleDisconnect(client: any) {
    const userId = client.handshake.auth.userId;
    this.connectedClients = this.connectedClients.filter((id) => id !== userId);
    console.log('disconnected', userId);
  }
  async afterInit(server: any) {
    this.games = await this.gameService.getGames();
    console.log(this.games);
  }
  games: Game[] = [];
  connectedClients: string[] = [];

  @WebSocketServer() server: Server;

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @MessageBody() data: CreateGameDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Game> {
    const playerId = client.handshake.auth.userId as string;
    console.log('createGame', data);
    if(data.playerId === data.oponentId) {
      throw new BadRequestException('You cannot play against yourself');
    }
    let game = null;
    if(!data.oponentId){
      //pick random player from connectedClients that is not the player
      const oponentId = this.connectedClients.find((id) => id !== playerId);
      if(!oponentId){
        throw new BadRequestException('No available oponents');
      }
      game = await this.gameService.createGame({
        playerId,
        oponentId,
      });
    }else {
      game = await this.gameService.createGame(data);
    }

    this.games.push(game);
    client.join(game.id);
    client.to(game.player2).emit('gameCreated', game);
    console.log('game', game);
    return game;
  }

  @SubscribeMessage('acceptGame')
  async handleAcceptGame(
    @MessageBody() gameId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<Game> {
    const userId = client.handshake.auth.userId as string;
    const game = await this.gameService.acceptGame(gameId, userId);
    client.to(game.id).emit('gameAccepted', game);
    client.join(game.id);
    console.log('acceptGame', game);
    return game;
  }

  @SubscribeMessage('getAllGames')
  async handleGetAllGames(@ConnectedSocket() client: Socket): Promise<Game[]> {
    const userId = client.handshake.auth.userId as string;
    const games = await this.gameService.getGames();
    const userGames = games.filter(
      (game) => game.player1 === userId || game.player2 === userId,
    );
    return await userGames;
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @MessageBody() data: MakeMoveDto,
    @ConnectedSocket() client: Socket,
  ): Promise<Game> {
    const userId = client.handshake.auth.userId as string;
    console.log(data)
    const game = await this.gameService.makeMove(
      data.gameId,
      userId,
      data.square,
    );
    client.to(game.id).emit('moveMade', game);
    return game;
  }
}
