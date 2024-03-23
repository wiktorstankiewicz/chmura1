import styles from "./App.module.css";
import { Game, GameStatus } from "./stores/games-store";

export type EmptyCell = null;

export type CellValue = "X" | "O" | EmptyCell;

export type Props = {
  game: Game;
  player: string;
  onMakeMove: (position: number) => void;
};

function TickTackToe({ game, player, onMakeMove }: Props) {
  return (
    <div>
      <p>
        Twój przeciwnik to:{" "}
        {player == game.player2 ? game.player1 : game.player2}
      </p>
      <p>Grasz jako {player == game.player2? game.player2Figure: game.player1Figure}</p>
      {game && <Board onMakeMove={onMakeMove} game={game} />}
      {game.status === GameStatus.PLAYER_1_WON && player == game.player1 && (
        <div>You won!</div>
      )}
      {game.status === GameStatus.PLAYER_2_WON && player == game.player2 && (
        <div>You won!</div>
      )}
      {game.status === GameStatus.DRAW && <div>Draw!</div>}
      {game.status === GameStatus.PLAYER_1_WON && player == game.player2 && (
        <div>You lost!</div>
      )}
      {game.status === GameStatus.PLAYER_2_WON && player == game.player1 && (
        <div>You lost!</div>
      )}
    </div>
  );
}

type BoardProps = {
  game: Game;
  onMakeMove: (position: number) => void;
};

function Board({ game, onMakeMove }: BoardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Cell value={game.square1} onMakeMove={() => onMakeMove(1)} />
        <Cell value={game.square2} onMakeMove={() => onMakeMove(2)} />
        <Cell value={game.square3} onMakeMove={() => onMakeMove(3)} />
      </div>
      <div className={styles.row}>
        <Cell value={game.square4} onMakeMove={() => onMakeMove(4)} />
        <Cell value={game.square5} onMakeMove={() => onMakeMove(5)} />
        <Cell value={game.square6} onMakeMove={() => onMakeMove(6)} />
      </div>
      <div className={styles.row}>
        <Cell value={game.square7} onMakeMove={() => onMakeMove(7)} />
        <Cell value={game.square8} onMakeMove={() => onMakeMove(8)} />
        <Cell value={game.square9} onMakeMove={() => onMakeMove(9)} />
      </div>
    </div>
  );
}

function XSvg() {
  return <img src="x.svg" className={styles.svg} />;
}

function OSvg() {
  return <img src="o.svg" className={styles.svg} />;
}

function Cell(props: { value: string, onMakeMove: () => void}) {
  return (
    <div className={styles.cell} onClick={props.onMakeMove}>
      <>
        {props.value === "X" && <XSvg />}
        {props.value === "O" && <OSvg />}
      </>
    </div>
  );
}

export default TickTackToe;
