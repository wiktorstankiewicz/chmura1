import { BadRequestException, Injectable } from '@nestjs/common';
import { Game, GameStatus } from '@prisma/client';
import GameRepository from './game.repository';
import CreateGameDto from './dto/create-game.dto';
@Injectable()
export default class GameService {
  constructor(private gameRepository: GameRepository) {}

  async getGames(): Promise<Game[]> {
    return this.gameRepository.getGames();
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    return this.gameRepository.createGame(createGameDto);
  }

  async acceptGame(gameId: string, userId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (game.status !== GameStatus.PENDING) {
      throw new BadRequestException('Game is not pending');
    }
    game.status = GameStatus.IN_PROGRESS;
    game.player2 = userId;
    return this.gameRepository.updateGame(game);
  }

  async getPendingGames(userId: string): Promise<Game[]> {
    return this.gameRepository.getGamesByStatus(userId, GameStatus.PENDING);
  }

  async getGamesInProgress(userId: string): Promise<Game[]> {
    return this.gameRepository.getGamesByStatus(userId, GameStatus.IN_PROGRESS);
  }

  async makeMove(
    gameId: string,
    userId: string,
    square: number,
  ): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    const isPlayer1 = userId === game.player1;
    const isPlayer2 = userId === game.player2;
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new BadRequestException('Game is not in progress');
    }
    if (this.calculateNextMove(game) === 'player1' && !isPlayer1) {
      throw new BadRequestException('Not your turn');
    }
    if (this.calculateNextMove(game) === 'player2' && !isPlayer2) {
      throw new BadRequestException('Not your turn');
    }

    if (square < 1 || square > 9) {
      throw new BadRequestException('Invalid square');
    }
    const squareKey = `square${square}`;
    if (game[squareKey] !== null) {
      throw new BadRequestException('Square is already taken');
    }
    game[squareKey] = isPlayer1 ? game.player1Figure : game.player2Figure;

    const winner = this.calculateWinner(game);

    if (winner) {
      switch (winner) {
        case 'player1':
          game.status = GameStatus.PLAYER_1_WON;
          break;
        case 'player2':
          game.status = GameStatus.PLAYER_2_WON;
          break;
        case 'draw':
          game.status = GameStatus.DRAW;
          break;
      }
    }

    return this.gameRepository.updateGame(game);
  }

  calculateNextMove(game: Game): 'player1' | 'player2' {
    const {
      square1,
      square2,
      square3,
      square4,
      square5,
      square6,
      square7,
      square8,
      square9,
    } = game;

    const moves = [
      square1,
      square2,
      square3,
      square4,
      square5,
      square6,
      square7,
      square8,
      square9,
    ];

    const xMoves = moves.filter((move) => move === 'X').length;
    const oMoves = moves.filter((move) => move === 'O').length;

    if (xMoves === oMoves) {
      return 'player1';
    }
    return 'player2';
  }

  calculateWinner(game: Game): 'player1' | 'player2' | 'draw' | null {
    const {
      square1,
      square2,
      square3,
      square4,
      square5,
      square6,
      square7,
      square8,
      square9,
    } = game;

    const linesHorizontal = [
      [square1, square2, square3],
      [square4, square5, square6],
      [square7, square8, square9],
    ];

    const linesVertical = [
      [square1, square4, square7],
      [square2, square5, square8],
      [square3, square6, square9],
    ];

    const linesDiagonal = [
      [square1, square5, square9],
      [square3, square5, square7],
    ];

    const player1Figure = game.startingFigure;
    const player2Figure = game.startingFigure === 'X' ? 'O' : 'X';

    for (const line of linesHorizontal) {
      if (
        line[0] === player1Figure &&
        line[1] === player1Figure &&
        line[2] === player1Figure
      ) {
        return 'player1';
      }
      if (
        line[0] === player2Figure &&
        line[1] === player2Figure &&
        line[2] === player2Figure
      ) {
        return 'player2';
      }
    }

    for (const line of linesVertical) {
      if (
        line[0] === player1Figure &&
        line[1] === player1Figure &&
        line[2] === player1Figure
      ) {
        return 'player1';
      }
      if (
        line[0] === player2Figure &&
        line[1] === player2Figure &&
        line[2] === player2Figure
      ) {
        return 'player2';
      }
    }

    for (const line of linesDiagonal) {
      if (
        line[0] === player1Figure &&
        line[1] === player1Figure &&
        line[2] === player1Figure
      ) {
        return 'player1';
      }
      if (
        line[0] === player2Figure &&
        line[1] === player2Figure &&
        line[2] === player2Figure
      ) {
        return 'player2';
      }
    }

    if (
      square1 &&
      square2 &&
      square3 &&
      square4 &&
      square5 &&
      square6 &&
      square7 &&
      square8 &&
      square9
    ) {
      return 'draw';
    }

    return null;
  }
}
