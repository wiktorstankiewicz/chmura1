import { Socket } from "socket.io-client";
import { createSocket } from "../utils/socket-io";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CreateGameDto {
  playerId: string;
  oponentId?: string;
}

export interface MakeMoveDto {
  gameId: string;
  square: number;
}
export interface GameStore {
  pendingGames: Game[];
  inProgressGames: Game[];

  connect: (userId: string) => void;
  disconnect: () => void;
  createGame: (dto: CreateGameDto) => void;
  acceptGame: (gameId: string) => void;
  makeMove: (makeMoveDto: MakeMoveDto) => void;
}

export interface Game {
  id: string;
  player1: string;
  player2: string;
  player1Figure: Figure;
  player2Figure: Figure;
  startingFigure: Figure;
  square1: Figure;
  square2: Figure;
  square3: Figure;
  square4: Figure;
  square5: Figure;
  square6: Figure;
  square7: Figure;
  square8: Figure;
  square9: Figure;
  status: GameStatus;
}

export enum Figure {
  X = "X",
  O = "O",
  Empty = "NONE",
}

export enum GameStatus {
  PLAYER_1_WON = "PLAYER_1_WON",
  PLAYER_2_WON = "PLAYER_2_WON",
  DRAW = "DRAW",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
}

let socket: Socket | null = null;

export const useGamesStore = create<GameStore>()(
  persist(
    (set, get) => ({
      pendingGames: [],
      inProgressGames: [],
      connect: (userId: string) => {
        const _socket = createSocket(userId);
        socket = _socket;
        socket.connect();
        _socket.on("connect", () => {
          _socket.emit("getAllGames", (games: Game[]) => {
            console.log("emit getAllGames", games);
            const pendingGames = games.filter(
              (g) => g.status === GameStatus.PENDING && g.player2 === userId
            );
            const inProgressGames = games.filter(
              (g) => g.status === GameStatus.IN_PROGRESS
            );
            set({ pendingGames, inProgressGames });
          });
        });
        _socket.connect();
        _socket.on("gameCreated", (game: Game) => {
          console.log("onGameCreated", game);
          set({ pendingGames: [...get().pendingGames, game] });
        });
        _socket.on("gameAccepted", (game: Game) => {
          console.log("onGameAccepted", game);
          set({ inProgressGames: [...get().inProgressGames, game], pendingGames: get().pendingGames.filter((g) => g.id !== game.id)});
        });
        _socket.on("moveMade", (game: Game) => {
          console.log("onMoveMade", game);
          set({
            inProgressGames: get().inProgressGames.map((g) =>
              g.id === game.id ? game : g
            ),
          });
        });
      },
      disconnect: () => {
        socket?.disconnect();
        set({ pendingGames: [], inProgressGames: [] });
      },
      createGame: (dto: CreateGameDto) => {
        socket?.emit("createGame", dto, (game: Game) => {
          console.log("emit createGame", game);
          set({ pendingGames: [...get().pendingGames, game] });
        });
      },
      acceptGame: (gameId: string) => {
        console.log("emit acceptGame", gameId);
        socket?.emit("acceptGame", gameId, (game: Game) => {
          set({
            pendingGames: get().pendingGames.filter((g) => g.id !== game.id),
            inProgressGames: [...get().inProgressGames, game],
          });
        });
      },
      makeMove: (makeMoveDto: MakeMoveDto) => {
        socket?.emit("makeMove", makeMoveDto, (game: Game) => {
          set({
            inProgressGames: get().inProgressGames.map((g) =>
              g.id === game.id ? game : g
            ),
          });
        });
      },
    }),
    {
      name: "games-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
