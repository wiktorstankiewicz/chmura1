import * as styles from "./App.module.css";
import PlayerSelectionComponent from "./components/PlayerSelectionComponent";
import UsernameInput from "./components/UsernameInput";

export type EmptyCell = null;

export type CellValue = "X" | "O" | EmptyCell;

export type BoardState = {
  values: (CellValue | EmptyCell)[];
  turn: CellValue;
  oponentName: string;
  yourFigure: CellValue;
};

function Game() {
  const state: BoardState = {
    values: ["O", null, null, "X", null, null, null, null, null],
    turn: "X",
    oponentName: "Krzysiek23",
    yourFigure: "O",
  };
  return (
    <div>
      <UsernameInput />
      <PlayerSelectionComponent />
      <p>Twój przeciwnik to: {state.oponentName}</p>
      <p>Grasz jako {state.yourFigure}</p>
      <Board state={state} />
      <p>You won!</p>
    </div>
  );
}

type BoardProps = {
  state: BoardState;
};

function Board(props: BoardProps) {
  const state = props.state;
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Cell value={state.values[0]} />
        <Cell value={state.values[1]} />
        <Cell value={state.values[2]} />
      </div>
      <div className={styles.row}>
        <Cell value={state.values[3]} />
        <Cell value={state.values[4]} />
        <Cell value={state.values[5]} />
      </div>
      <div className={styles.row}>
        <Cell value={state.values[6]} />
        <Cell value={state.values[7]} />
        <Cell value={state.values[8]} />
      </div>
    </div>
  );
}

function XSvg() {
  return <img src="public/x.svg" className={styles.svg} />;
}

function OSvg() {
  return <img src="public/o.svg" className={styles.svg} />;
}

function Cell(props: { value: CellValue }) {
  return (
    <div className={styles.cell}>
      <>
        {props.value === "X" && <XSvg />}
        {props.value === "O" && <OSvg />}
      </>
    </div>
  );
}

export default Game;
