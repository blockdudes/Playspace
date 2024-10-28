// /components/dashboard/GameCategoryCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface GameCategoryCardProps {
  title: string;
  description: string;
  gradient: string; 
  onClick: () => void;
}

const GameCategoryCard: React.FC<GameCategoryCardProps> = ({ title, description, gradient, onClick }) => (
  <Card
    onClick={onClick}
    className={`bg-gradient-to-r from-[#2A2C35]/80 to-[#14151A]/80 backdrop-blur-sm transition-all duration-300 transform hover:from-[#3A3C45]/80 hover:to-[#24252A]/80 hover:scale-105`}
  >
    <CardContent className="flex justify-between items-center p-6">
      <div>
        <h3
          className={`text-xl font-bold mb-2 text-transparent bg-clip-text ${gradient} transition-all duration-300 group-hover:bg-clip-text group-hover:${gradient}`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <ChevronRight className="h-6 w-6 text-gray-400 animate-pulse" />
    </CardContent>
  </Card>
);

export default GameCategoryCard;
