import { useEffect, useState } from "react";
import { useUserStore } from "../stores/user-store";
import { useGamesStore } from "../stores/games-store";
import TickTackToe from "../Game";
import { logout } from "../utils/cognito";
import { useNavigate } from "react-router-dom";

type Props = {};

function SelectGamePage({}: Props) {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const { connect, createGame, acceptGame, makeMove, pendingGames, inProgressGames, disconnect } = useGamesStore();
  const myPendingGames = pendingGames.filter((g) => g.player2 === userStore.user?.email);
  const [oponent, setOponent] = useState("");
  useEffect(() => {
    if(!userStore.user) {
      return;
    }
    connect(userStore.user);
    document.title = userStore?.user!.email;
    return () => {
      disconnect();
    };
  }
  , [userStore.user]);

  return (
    <div>
      <h1>TickTackToe</h1>
      <button onClick={() => logout().then(
        () => {
          userStore.logout();
          navigate('/login')
        }
      )}>Logout</button>
      <h2>Welcome, {userStore.user?.email}</h2>
      <button onClick={() => createGame({playerId: userStore?.user!.email})}>Send game request to random player!</button>
      
      <h2>Select oponent</h2>
      <input type="text" value={oponent} onChange={(e) => setOponent(e.target.value)} />
      <button onClick={() => createGame({ playerId: userStore?.user!.email, oponentId: oponent })}>
         Send game Request
      </button>
      <h2>Pending Games</h2>
      <ul>
        {myPendingGames.map((game) => (
          <li key={game.id}>
            <h3>Game ID: {game.id}</h3>
            <button onClick={() => acceptGame(game.id)}>Accept Game</button>
          </li>
        ))}
      </ul>
      <h2>In Progress Games</h2>
      <ul>
        {inProgressGames.map((game) => (
          <li key={game.id}>
            <TickTackToe player={userStore?.user!.email} game={game} onMakeMove={(position: number) => makeMove({ gameId: game.id, square: position  })} /> 
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SelectGamePage;
