import { Game, GameStatus, PrismaClient } from '@prisma/client';
import CreateGameDto from './dto/create-game.dto';
import { Injectable } from '@nestjs/common';
@Injectable()
export default class GameRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    return await this.prisma.game.create({
      data: {
        player1: createGameDto.playerId,
        player2: createGameDto.oponentId,
        status: GameStatus.PENDING,
      },
    });
  }
  async getGameById(gameId: string) {
    return await this.prisma.game.findUnique({ where: { id: gameId } });
  }

  async updateGame(game: Game) {
    return await this.prisma.game.update({
      where: { id: game.id },
      data: game,
    });
  }

  async getGamesByStatus(userId: string, status: GameStatus) {
    return await this.prisma.game.findMany({
      where: {
        player1: userId,
        status,
      },
    });
  }

  async getGames(): Promise<Game[]> {
    return await this.prisma.game.findMany();
  }
}
