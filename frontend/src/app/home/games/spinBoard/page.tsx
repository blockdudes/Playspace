'use client';
import React, { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
import "./SpinningBoard.css";
import { approveTokens, transferFromTokens } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { connectWallet } from "@/lib/reducers/integrate_wallet_slice";
import { getUserData } from "@/lib/reducers/user_data_slice";
import { adminClient } from "@/admin/signer";
import axios from "axios";

const RouletteGame = () => {
  const levels = {
    easy: [
      { option: "1" },
      { option: "2" },
      { option: "3" },
      { option: "4" },
      { option: "5" },
      { option: "6" },
    ],
    medium: [
      { option: "1" },
      { option: "2" },
      { option: "3" },
      { option: "4" },
      { option: "5" },
      { option: "6" },
      { option: "7" },
      { option: "8" },
      { option: "9" },
      { option: "10" },
      { option: "11" },
      { option: "12" },
    ],
    hard: [
      { option: "a" },
      { option: "b" },
      { option: "c" },
      { option: "d" },
      { option: "e" },
      { option: "f" },
      { option: "g" },
      { option: "h" },
      { option: "i" },
      { option: "j" },
      { option: "k" },
      { option: "l" },
      { option: "m" },
      { option: "n" },
      { option: "o" },
      { option: "p" },
      { option: "q" },
      { option: "r" },
      { option: "s" },
      { option: "t" },
      { option: "u" },
      { option: "v" },
      { option: "w" },
      { option: "x" },
      { option: "y" },
      { option: "z" },
    ],
  };

  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [selectedOption, setSelectedOption] = useState("");
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const wallet = useAppSelector(state => state.wallet);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connectWallet())
  }, [])

  useEffect(() => {
    if (wallet.signer) {
      dispatch(getUserData(wallet.signer));
    }
  }, [wallet])

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setSelectedOption("");
    setResult(null);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleSpinClick = async () => {
    if (!selectedOption) {
      alert("Please select an option before spinning.");
      return;
    }

    await approveTokens(10, wallet);
    const levelData = levels[selectedLevel as keyof typeof levels];
    const newPrizeNumber = Math.floor(Math.random() * levelData.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);
    const winningOption = levels[selectedLevel as keyof typeof levels][prizeNumber].option;
    const isWin = winningOption === selectedOption;
    setResult(
      isWin ? `You Won! - ${winningOption}` : `You Lost! - ${winningOption}`
    );
    playAudio(isWin);
    let resultData: any;

    if (isWin === true) {
      resultData = {
        reward: 200,
        game: "671f4d500a719482329b99ee",
        player: user?.user?._id,
        result: "WIN",
        timePassed: 0,
        gambleAmount: 10
      };
    } else {
      await transferFromTokens(10, wallet, adminClient);
      resultData = {
        reward: 0,
        game: "671f4d500a719482329b99ee",
        player: user?.user?._id,
        result: "LOSS",
        timePassed: 0,
        gambleAmount: 10
      };
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/store/rewards`, resultData);
    console.log(response.data);
  };

  const playAudio = (isWin: boolean) => {
    const audio = new Audio(
      isWin ? "/Sound/win.mp3" : "/Sound/loss.mp3"
    );
    audio.play();
  };

  return (
    <div className="roulette-game min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-bold text-yellow-400 mb-6">Try Your Luck!</h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleLevelChange("easy")}
          className={`px-4 py-2 rounded-lg font-semibold ${selectedLevel === "easy" ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"} transition-all duration-300`}
        >
          Easy
        </button>
        <button
          onClick={() => handleLevelChange("medium")}
          className={`px-4 py-2 rounded-lg font-semibold ${selectedLevel === "medium" ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"} transition-all duration-300`}
        >
          Medium
        </button>
        <button
          onClick={() => handleLevelChange("hard")}
          className={`px-4 py-2 rounded-lg font-semibold ${selectedLevel === "hard" ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"} transition-all duration-300`}
        >
          Hard
        </button>
      </div>

      <div className="mb-6">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white w-60"
        >
          <option value="">Select an option</option>
          {levels[selectedLevel as keyof typeof levels].map((item, index) => (
            <option key={index} value={item.option}>
              {item.option}
            </option>
          ))}
        </select>
      </div>

      <div className="roulette-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={levels[selectedLevel as keyof typeof levels]}
          onStopSpinning={handleStopSpinning}
          spinDuration={0.4}
          innerBorderColor={"#ccc"}
          outerBorderWidth={9}
          outerBorderColor={"#f2f2f2"}
          radiusLineColor={"transparent"}
          radiusLineWidth={1}
          textColors={["#f5f5f5"]}
          textDistance={55}
          fontSize={10}
          backgroundColors={[
            "#3f297e",
            "#175fa9",
            "#169ed8",
            "#239b63",
            "#64b031",
            "#efe61f",
            "#f7a416",
            "#e6471d",
            "#dc0936",
            "#e5177b",
            "#be1180",
            "#871f7f",
          ]}
        />
        <button
          className="roulette-button"
          onClick={handleSpinClick}
          disabled={mustSpin}
        >
          Spin
        </button>
      </div>

      {result && <div className="text-2xl font-semibold text-white">{result}</div>}
    </div>
  );
};

export default RouletteGame;
