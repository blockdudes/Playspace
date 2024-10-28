import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getGameData } from "@/lib/reducers/game_data_slice";

export interface Game {
    gameId: string;
    gameName: string;
    gameImages: string[];
    gamePlayerCount: number;
    gameTokenSymbol: string;
    gameCategory: string;
    gameType: "GAMBLING" | "EARNING" | "PRACTICE";
    gameDescription: string;
    gameRating: string;
    gameCreator: any;
    gameData: string;
}


const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
};

const GameGrid: React.FC<{ searchQuery: string, registered: boolean, setShowRegisterPrompt: (show: boolean) => void }> = ({ searchQuery, registered, setShowRegisterPrompt }) => {
    const router = useRouter();
    const games = useAppSelector(state => state.games);
    const dispatch = useAppDispatch();

    const [filteredGames, setFilteredGames] = useState<Game[]>([]);

    useEffect(() => {
        dispatch(getGameData());
    }, [dispatch]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const playToEarnGames = games.games?.filter((game: Game) => game.gameType === 'EARNING') || [];
        const filtered = playToEarnGames.filter((game: Game) =>
            game.gameName.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredGames(filtered);
    }, [games, searchQuery]); // Depend on `games` and `searchQuery`

    const handleGameLaunch = (game: Game) => {
        if (!registered) {
            setShowRegisterPrompt(true);
        } else {
            router.push(`/home/games/playToEarn/${game.gameId}`);
        }
    };

    return (
        <div className="grid grid-cols-6 gap-4">
            {filteredGames.map(game => (
                <Card
                    key={game.gameId}
                    onClick={() => handleGameLaunch(game)}
                    className="relative aspect-square overflow-hidden group transition-all duration-300 transform hover:scale-110 hover:rotate-3 hover:shadow-lg"
                    style={{ backgroundColor: getRandomColor(), opacity: 0.6 }}
                >
                    <CardContent className="flex items-center justify-center h-full relative">
                        <img src={game.gameImages[0]} alt={game.gameName} className="absolute text-3xl inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="text-lg font-bold z-10 text-white transition-all duration-300">{game.gameName}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default GameGrid;
