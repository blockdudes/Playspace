"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, DollarSign, ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"

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

const user: User = {
  name: "Alex Gamer",
  username: "alexthegamer",
  avatar: "/placeholder.svg?height=128&width=128",
  level: 42,
  totalEarnings: 15000
}

const gamblingGames: GamblingGame[] = [
  { id: 1, name: "Poker Night", result: 'win', amount: 500, date: "2023-06-15" },
  { id: 2, name: "Blackjack Bonanza", result: 'lose', amount: 200, date: "2023-06-14" },
  { id: 3, name: "Roulette Royale", result: 'win', amount: 1000, date: "2023-06-13" },
  { id: 4, name: "Slot Spectacular", result: 'lose', amount: 50, date: "2023-06-12" },
]

const playToEarnGames: PlayToEarnGame[] = [
  { id: 1, name: "Crypto Crushers", timePlayed: 120, earnings: 75, date: "2023-06-15" },
  { id: 2, name: "NFT Ninjas", timePlayed: 90, earnings: 50, date: "2023-06-14" },
  { id: 3, name: "Blockchain Battles", timePlayed: 180, earnings: 200, date: "2023-06-13" },
  { id: 4, name: "DeFi Defenders", timePlayed: 60, earnings: 30, date: "2023-06-12" },
]

export default function GamingProfile() {
  return (
    <div className="container mx-auto p-4 ">
      <Card className="h-[90vh] max-w-6xl mx-auto bg-gray-800 text-white border-2 border-gray-600">
        <CardHeader className="border-b border-gray-700">
            <Button variant="ghost" className="absolute top-2 left-2 w-20 h-20 p-12 hover:bg-transparent hover:text-white hover:underline ">
                <ArrowLeft className="w-10 h-10 hover:bg-none" /> Go Back
            </Button>
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24 border-2 border-primary ">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold text-white">{user.name}</CardTitle>
              <p className="text-gray-300">@{user.username}</p>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/80">
                  Level {user.level}
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  ${user.totalEarnings.toLocaleString()} earned
                </Badge>
              </div>
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
                {game.timePlayed} min
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
