"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, DollarSign, ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useEffect, useState } from "react"
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "cosmwasm"
import { accounts, adminClient } from "@/admin/signer"
import { getUserData } from "@/lib/reducers/user_data_slice"
import { connectWallet } from "@/lib/reducers/integrate_wallet_slice"


type GamblingGame = {
  id: number
  name: string
  result: 'win' | 'lose'
  amount: number
  date: string
}

type PlayToEarnGame = {
  id: number
  name: string
  timePlayed: number
  earnings: number
  date: string
}

type User = {
  name: string
  username: string
  avatar: string
  level: number
  totalEarnings: number
}

async function fetchGameHistoryByUserAddress(userAddress: string, setHistory: any) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/games/history/${userAddress}`);
    setHistory(response?.data?.userGameHistory)
  } catch (error) {
    console.error('Error fetching game history:', error);
  }
}

async function claimRewardsForUser(userAddress: string) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/claim/rewards/${userAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error claiming rewards:', error);
  }
}

async function claimRewards(wallet: any, accounts: any, dispatch: any, user: any) {
  try {
    if (!wallet.error && wallet.signer) {
      const executeContractMessage = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          sender: accounts.address,
          contract: process.env.NEXT_PUBLIC_GAME_TOKEN_CONTRACT_ADDRESS,
          msg: toUtf8(JSON.stringify({
            transfer: {
              recipient: accounts.address,
              amount: user?.rewards
            }
          })),
          funds: []
        })
      };

      const fee = {
        amount: [{ amount: "280000000000000000", denom: "aconst" }],
        gas: "2000000"
      };

      const result = await adminClient.signAndBroadcast(
        accounts.address,
        [executeContractMessage],
        fee,
        ""
      );
      if (result.code === 0) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/claim/rewards/${wallet.signer}`);
        if (response.data) {
          dispatch(getUserData(wallet.signer));
        }
      }

    } else {
      console.log("connect your wallet!");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Invalid string. Length must be a multiple of 4")) {
      console.warn("Non-critical error during transaction decoding:", error.message);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/claim/rewards/${wallet.signer}`);
      if (response.data) {
        dispatch(getUserData(wallet.signer));
      }
    } else {
      throw error;
    }
  }
}


export default function GamingProfile() {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector((state) => state.wallet);
  const user = useAppSelector((state) => state.user.user);
  const [history, setHistory] = useState([]);
  console.log('history', history)
  console.log('user', history)
  async function handleClaimRewards() {
    try {
      if (!user || !wallet.signer || !accounts.address || !dispatch) {
        throw new Error('Missing required data')
      }
      if (user?.rewards <= 0) {
        throw new Error('No rewards to claim')
      }
      await claimRewards(wallet, accounts, dispatch, user);
      const data = await claimRewardsForUser(wallet.signer);
      return data;
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  }

  useEffect(() => {
    dispatch(connectWallet())
  }, [])

  useEffect(() => {
    if (wallet.signer) {
      dispatch(getUserData(wallet.signer));
      fetchGameHistoryByUserAddress(wallet.signer, setHistory);
    }
  }, [wallet]);

  let gamblingGamesData = history?.filter((game: any) => game.game.gameType === "GAMBLING")
  let gamblingGames = gamblingGamesData?.map((game: any) => {
    console.log('game', game)
    return {
      id: game.game.gameId,
      name: game.game.gameName,
      result: game.result,
      amount: game.result === "LOSS" ? game.gambleAmount : game.reward,
      date: new Date(game.updatedAt).toLocaleString()
    }
  })
  let playToEarnGamesData = history?.filter((game: any) => game.game.gameType === "EARNING")
  let playToEarnGames = playToEarnGamesData?.map((game: any) => {
    return {
      id: game.game.gameId,
      name: game.game.gameName,
      timePlayed: game.timePassed,
      earnings: game.reward || 0,
      date: new Date(game.updatedAt).toLocaleString()
    }
  })


  return (
    <div className="container mx-auto p-4 ">
      <Card className="h-[90vh] max-w-6xl mx-auto bg-gray-800 text-white border-2 border-gray-600">
        <CardHeader className="border-b border-gray-700">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-2 border-primary ">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-white">{user?.name}</CardTitle>
                <p className="text-gray-300">@{user?.username}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/80">
                    Level {user?.level}
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    ${user?.rewards.toLocaleString()} earned
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="text-gray-300">Rewards - {user?.rewards.toLocaleString()}$</div>
              <button className="bg-primary text-primary-foreground hover:bg-white hover:text-primary p-2 rounded-md" onClick={handleClaimRewards}>Claim</button>
            </div>
          </div>

        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="gambling" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger
                value="gambling"
                className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300"
              >
                Gambling Games
              </TabsTrigger>
              <TabsTrigger
                value="play-to-earn"
                className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-300"
              >
                Play to Earn
              </TabsTrigger>
            </TabsList>
            <TabsContent value="gambling">
              <GamblingHistoryTable games={gamblingGames} />
            </TabsContent>
            <TabsContent value="play-to-earn">
              <PlayToEarnHistoryTable games={playToEarnGames} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function GamblingHistoryTable({ games }: { games: GamblingGame[] }) {
  return (
    <div className="max-h-[400px] overflow-y-auto scrollbar-custom">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">Game</TableHead>
            <TableHead className="text-gray-300">Result</TableHead>
            <TableHead className="text-gray-300">Amount</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id} className="border-b border-gray-700">
              <TableCell className="font-medium text-white">{game.name}</TableCell>
              <TableCell>
                <Badge variant={game.result === 'win' ? 'default' : 'destructive'}
                  className={game.result === 'win' ? "text-white bg-green-600" : "text-white"}>
                  {game.result === 'win' ? <Trophy className="w-4 h-4 mr-1" /> : <DollarSign className="w-4 h-4 mr-1" />}
                  {game.result}
                </Badge>
              </TableCell>
              <TableCell className="text-white">${game.amount}</TableCell>
              <TableCell className="text-white">{game.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function PlayToEarnHistoryTable({ games }: { games: PlayToEarnGame[] }) {
  return (
    <div className="max-h-[400px] overflow-y-auto scrollbar-custom">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300">Game</TableHead>
            <TableHead className="text-gray-300">Time Played</TableHead>
            <TableHead className="text-gray-300">Earnings</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id} className="border-b border-gray-700">
              <TableCell className="font-medium text-white">{game.name}</TableCell>
              <TableCell className="text-white">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-400" />
                  {game.timePlayed} sec
                </div>
              </TableCell>
              <TableCell className="text-white">
                <div className="flex items-center text-green-400">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {game.earnings}
                </div>
              </TableCell>
              <TableCell className="text-white">{game.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
