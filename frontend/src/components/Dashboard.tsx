'use client'
import React, { useState, lazy, Suspense } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Header from "@/components/Dashboard/Header";
import BonusCard from "@/components/Dashboard/BonusCard";
const GameCategoryCard = lazy(() => import("@/components/Dashboard/GameCategoryCard"));
const GameSearch = lazy(() => import("@/components/Dashboard/GameSearch"));
const GameGrid = lazy(() => import("@/components/Dashboard/GameGrid"));
import RegisterPromptModal from "./general/RegisterPromptModal";
import SwapComponent from "./general/Swap";
import RegistrationForm from "./general/RegistrationForm";
import GamingProfile from "./User/UserProfile";
import GameListingForm from "./general/RegisterGame";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";
import { Game } from "@/app/home/games/playToEarn/page";

export default function Dashboard() {
  const [isRegistered, setIsRegistered] = useState(false); // User registration status
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false); // Modal visibility
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleGameClick = (gameId: number) => {
    if (!isRegistered) {
      setShowRegisterPrompt(true);
    }
    else {
      router.push(`/home/games/playToEarn/${gameId}`);
    }
  };


  return (
    <div className="flex h-screen bg-[#1F2128] text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 opacity-50" />
      </div>

      <Sidebar />
      <main className="flex-1 p-6 overflow-auto bg-[#1F2128]/50 backdrop-blur-sm z-10">
        <Header registered={isRegistered} walletConnected={true} />
        <BonusCard />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Suspense fallback={<div>Loading...</div>}>
            <GameCategoryCard
              title="Spades"
              description="Play the classic card game of Spades against your friends."
              gradient="bg-gradient-to-r from-blue-400 to-purple-400"
              onClick={() => handleGameClick(22)}
            />
            <GameCategoryCard
              title="Cricket Champions Cup"
              description="Play the classic cricket game and earn rewards."
              gradient="bg-gradient-to-r from-green-400 to-blue-400"
              onClick={() => handleGameClick(23)}
            />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <GameSearch onSearchChange={setSearchQuery} />
          <GameGrid searchQuery={searchQuery} registered={isRegistered} setShowRegisterPrompt={setShowRegisterPrompt} />
        </Suspense>
      </main>

      <RegisterPromptModal show={showRegisterPrompt} onClose={() => setShowRegisterPrompt(false)} />
    </div>
  );
}
