import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BonusCard: React.FC = () => {
  const router = useRouter();

  return (
    <Card className="bg-gradient-to-r from-[#2A2C35]/80 to-[#14151A]/80 backdrop-blur-sm mb-6 overflow-hidden">
      <CardContent className="flex justify-between items-center p-6 relative">
      <div className="z-10">
        <h2 className="text-2xl text-white font-bold mb-2">Purchase Bonus <span className="text-yellow-400 animate-pulse">20%</span> extra</h2>
        <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-2">when you buy over 200 tokens</p>
        <p className="text-sm text-gray-400 mb-4">Get more with your purchase!</p>
        <Button className="bg-green-500 hover:bg-green-600 transition-all duration-300 transform hover:scale-105 animate-pulse" onClick={() => router.push('/Swap')}>
          Buy Tokens
        </Button>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/50 to-transparent">
        <Image
          src="/assets/character2.png"
          height={300}
          width={300}
          alt="Bonus character"
          className="absolute right-4 top-1/3 transform -translate-y-1/2 animate-bounce z-40"
        />
      </div>
    </CardContent>
    </Card>
  );
};

export default BonusCard;
