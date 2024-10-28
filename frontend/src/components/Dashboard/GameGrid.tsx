import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Game } from "@/app/home/games/playToEarn/page";
import { useRouter } from "next/navigation";
import { games as allGames } from "@/app/home/games/playToEarn/page";

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
};

const GameGrid: React.FC<{ searchQuery: string, registered: boolean, setShowRegisterPrompt: (show: boolean) => void }> = ({ searchQuery, registered, setShowRegisterPrompt }) => {
    const router = useRouter();
    const [filteredGames, setFilteredGames] = useState(allGames);

    useEffect(() => {
        // Filter games based on search query
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = allGames.filter(game =>
            game.title.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredGames(filtered);
    }, [searchQuery]);

    const handleGameLaunch = (game: Game) => {
        if (!registered) {
            setShowRegisterPrompt(true);
        }
        else {
            router.push(`/home/games/playToEarn/${game.id}`)
        }
    };

    return (
    <div className="grid grid-cols-6 gap-4">
        {filteredGames.map((game) => (
            <Card
                key={game.id}
                onClick={() => handleGameLaunch(game)}
                className="relative aspect-square overflow-hidden group transition-all duration-300 transform hover:scale-110 hover:rotate-3 hover:shadow-lg"
                style={{ backgroundColor: getRandomColor(), opacity: 0.6 }}
            >
                <CardContent className="flex items-center justify-center h-full relative">
                    <img src={game.image} alt={game.title} className="absolute text-3xl inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-lg font-bold z-10 text-white transition-all duration-300">{game.title}</span>
                </CardContent>
            </Card>
        ))}
    </div>
)};

export default GameGrid;
