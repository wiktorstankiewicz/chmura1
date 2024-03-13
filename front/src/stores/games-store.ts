import create from 'zustand' 

export default function useGamesStore = create((set) => ({
    allGames: [],
    createGame: 