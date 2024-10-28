"use client"

import { useState } from "react"
import { Search, X, Users, Coins, Star, Gamepad2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export type Game = {
  id: number
  title: string
  image: string
  playerCount: number
  tokenSymbol: string
  category: "Strategy" | "Adventure" | "Collectible"
  description: string
  rating: number
  gameUrl: string
}

export const games: Game[] = [
    {
      id: 1,
      title: "Subway Surfers",
      image: "https://i.pinimg.com/originals/5e/06/06/5e0606fa24129d51e2fda7608e9b079a.jpg",
      playerCount: 2500000,
      tokenSymbol: "LEGEND",
      category: "Collectible",
      description: "Run as fast as you can through the subway!",
      rating: 4.5,
      gameUrl: "https://www.jopi.com/embed.php?game=subway-surfers",
    },
    {
      id: 2,
      title: "Marble Quest",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfgP74aLwkJ4K8EBjfM0gDJnoNFXz3lXC-cg&s",
      playerCount: 150000,
      tokenSymbol: "MARB",
      category: "Adventure",
      description: "Navigate your marble through challenging mazes!",
      rating: 4.0,
      gameUrl: "https://microstudio.io/HomineLudens/marblequest/",
    },
    {
      id: 3,
      title: "Summer Maze",
      image: "https://cdn5.vectorstock.com/i/1000x1000/80/04/summer-holiday-easy-kids-maze-vector-32208004.jpg",
      playerCount: 85000,
      tokenSymbol: "SUN",
      category: "Strategy",
      description: "Solve mazes under the summer sun!",
      rating: 3.8,
      gameUrl: "https://www.jopi.com/gam/summer-maze/",
    },
    {
      id: 4,
      title: "Key Quest",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFoyJzvLlSmhHyrhIkjPCj01h-D-9gf10X-Q&s",
      playerCount: 125000,
      tokenSymbol: "KEYS",
      category: "Adventure",
      description: "Unlock secrets and find your way to victory!",
      rating: 4.2,
      gameUrl: "https://www.jopi.com/gam/key-quest/",
    },
    {
      id: 5,
      title: "Master Sudoku",
      image: "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/s/sudoku-master-switch/hero",
      playerCount: 200000,
      tokenSymbol: "SUDOKU",
      category: "Strategy",
      description: "Challenge your mind with intricate sudoku puzzles.",
      rating: 4.7,
      gameUrl: "https://www.jopi.com/gam/master-sudoku/",
    },
    {
      id: 6,
      title: "Way to Home",
      image: "https://img2.tapimg.net/moment/etag/FhrJubJnljWn4TtO89FRiB_8TeOa.jpg?imageMogr2/thumbnail/1080x9999%3E/quality/80/format/jpg/interlace/1/ignore-error/1",
      playerCount: 98000,
      tokenSymbol: "PATH",
      category: "Adventure",
      description: "Find your way back home through tricky paths!",
      rating: 4.3,
      gameUrl: "https://www.jopi.com/gam/way-to-home/",
    },
    {
      id: 7,
      title: "Neon Bricks",
      image: "https://www.cbc.ca/kids/images/neonbricks_thumb.jpg",
      playerCount: 54000,
      tokenSymbol: "NEON",
      category: "Strategy",
      description: "Break all the neon bricks and advance!",
      rating: 4.1,
      gameUrl: "https://www.jopi.com/gam/neon-bricks/",
    },
    {
        id: 8,
        title: "MOTO X3M",
        image: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/2c6d5a46cdbceada277c870ce1c389ee.jpg",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Compete in global table tennis tournaments!",
        rating: 4.6,
        gameUrl: "https://www.jopi.com/embed.php?game=moto-x3m",  
    },
    {
        id: 9,
        title: "Shell Shocker",
        image: "https://www.jopi.com/cdn-cgi/image/quality=78,width=192,height=192,fit=cover,f=auto/img/t/shell-shockers.png",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Compete in global table tennis tournaments!",
        rating: 4.6,
        gameUrl: "https://www.jopi.com/embed.php?game=shell-shockers",  
    },
    {
        id: 10,
        title: "Angry Birds",
        image: "https://c4.wallpaperflare.com/wallpaper/897/71/738/angry-birds-minimalism-wallpaper-thumb.jpg",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Shoot the pigs and save the birds!",
        rating: 4,
        gameUrl: "https://www.jopi.com/embed.php?game=angry-heroes",  
    },
    {
        id: 11,
        title: "Smash Karts",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuRCoxFzOTqfKG-jo22FZSYeMJo0ELKnbPlQ&s",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Compete in global table tennis tournaments!",
        rating: 4.6,
        gameUrl: "https://www.jopi.com/embed.php?game=smash-karts-io",  
    },
    {
        id: 12,
        title: "Temple run 2",
        image: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/f4b3ac7fe25cad9bc028b33f7a407f28.png",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Compete in global table tennis tournaments!",
        rating: 4.6,
        gameUrl: "https://www.jopi.com/embed.php?game=temple-run-2",  
    },
    {
        id: 13,
        title: "Table tennis",
        image: "https://images.crazygames.com/table-tennis-world-tour_16x9/20230908041108/table-tennis-world-tour_16x9-cover?auto=format,compress&q=75&cs=strip",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Compete in global table tennis tournaments!",
        rating: 4.6,
        gameUrl: "https://www.jopi.com/embed.php?game=table-tennis-world-tour",  
    },
    {
        id: 14,
        title: "Vex Challenges",
        image: "https://images.crazygames.com/games/vex-challenges/cover-1685550748361.png?auto=format,compress&q=75&cs=strip",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Compete in global table tennis tournaments!",
        rating: 4.6,
        gameUrl: "https://www.jopi.com/embed.php?game=vex-challenges",  
    },
    {
        id: 15,
        title: "Red Ball 4",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHTDV8EGek8GO5O8cPulfsN_CLR1jVOYD7hg&s",
        playerCount: 120000,
        tokenSymbol: "PING",
        category: "Adventure",
        description: "Compete in global table tennis tournaments!",
        rating: 4.6,
        gameUrl: "https://www.jopi.com/embed.php?game=red-ball-4",  
    },
    {
        id: 16,
        title: "Dice",
        image: "https://mediumrare.imgix.net/30688668d7d2d48d472edd0f1e2bca0758e7ec51cbab8c04d8b7f157848640e0?&dpr=2&format=auto&auto=format&q=50",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Strategy", 
        description: "Challenge your luck and strategic thinking with Dice!", 
        rating: 3.5, 
        gameUrl: "https://www.jopi.com/embed.php?game=dice-gang",
    },
    {
        id: 17,
        title: "Cards",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgvWHJbYKIMhNcu5-N-yW8KbXn1ofkzeGLyg",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Strategy", 
        description: "Engage in thrilling card battles and outsmart your opponents.", 
        rating: 4.0, 
        gameUrl: "https://www.jopi.com/embed.php?game=duo-cards",
    },
    {
        id: 18,
        title: "3 Card Monte",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLXWQeL_lOnW0g_tUE7QiFUS9qEfqHefEiPg&s",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Adventure", 
        description: "Test your observation skills and find the queen card.", 
        rating: 3.0, 
        gameUrl: "https://www.jopi.com/embed.php?game=3-card-monte",
    },
    {
        id: 19,
        title: "Ludo",
        image: "https://images.crazygames.com/games/ludo-hero/cover-1586285558737.jpg?auto=format,compress&q=75&cs=strip",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Strategy", 
        description: "Enjoy the classic game of Ludo where strategy and luck collide.", 
        rating: 4.2, 
        gameUrl: "https://www.jopi.com/embed.php?game=ludo-hero",
    },
    {
        id: 20,
        title: "Solitaire",
        image: "https://play-lh.googleusercontent.com/tc90mcibgT9caAQHmSC2MBxG72iL1HCUjiheIlM8z90_jvyO_Qz306tlovwaKaEPFA=w526-h296-rw",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Strategy", 
        description: "Relax and sharpen your mind with the timeless game of Solitaire.", 
        rating: 4.8, 
        gameUrl: "https://www.jopi.com/embed.php?game=solitaire-classic",
    },
    {
        id: 21,
        title: "Bubble Shooter",
        image: "https://static.keygames.com/9/78739/44869/672x448/bubble-shooter.webp",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Adventure", 
        description: "Pop bubbles in this colorful, fun, and relaxing puzzle adventure.", 
        rating: 4.3, 
        gameUrl: "https://www.jopi.com/embed.php?game=bubble-shooter",
    },
    {
        id: 22,
        title: "Spades",
        image: "https://play-lh.googleusercontent.com/p3h0rlTb0lPvAPoLIK_i-wwGAgmXSlOaDI2CeQo8dC-C1NhFwNZEdnCfyPlZIyHp-OU",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Strategy", 
        description: "Play the classic card game of Spades against your friends.", 
        rating: 4.3, 
        gameUrl: "https://www.jopi.com/embed.php?game=spades",
    },
    {
        id: 23,
        title: "Cricket Champions Cup",
        image: "https://d2l63a9diffym2.cloudfront.net/tournament/U1D0gJ4gmOcHlIxEwz050oxzN2EVezy33kUYdzYe.jpg",
        playerCount: 2500000,
        tokenSymbol: "LEGEND",
        category: "Adventure", 
        description: "Play the classic cricket game and earn rewards.", 
        rating: 4.3, 
        gameUrl: "https://www.jopi.com/embed.php?game=cricket-champions-cup",
    },


]

export default function GamingHub() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || game.category === selectedCategory)
  )

  const handleGameLaunch = (game: Game) => {
    router.push(`/home/games/playToEarn/${game.id}`)
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8 lg:p-16 pt-[env(safe-area-inset-top)] ">
<header className="flex flex-col items-center mb-8 pt-4 md:pt-8">
    <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
      CryptoGaming Hub
    </h1>
    <div className="flex items-center w-full max-w-md">
      <Search className="text-gray-400 mr-2" />
      <Input
        type="text"
        placeholder="Search games..."
        className="flex-grow bg-gray-800/50 text-white placeholder-gray-400 border-gray-700 focus:border-purple-500 transition-colors"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchTerm("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  </header>

      <main className="container mx-auto">
        <Tabs defaultValue="All" className="mb-6 flex justify-center">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1 rounded-full flex space-x-4">
            <TabsTrigger value="All" onClick={() => setSelectedCategory("All")} className="rounded-full">All Games</TabsTrigger>
            <TabsTrigger value="Strategy" onClick={() => setSelectedCategory("Strategy")} className="rounded-full">Strategy</TabsTrigger>
            <TabsTrigger value="Adventure" onClick={() => setSelectedCategory("Adventure")} className="rounded-full">Adventure</TabsTrigger>
            <TabsTrigger value="Collectible" onClick={() => setSelectedCategory("Collectible")} className="rounded-full">Collectible</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {isLoading
            ? Array(12).fill(0).map((_, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))
            : filteredGames.map((game) => (
                <Card key={game.id} className="bg-gray-800/50 border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 group">
                  <div className="relative">
                    <Image
                      src={game.image}
                      alt={game.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <Badge className="absolute top-2 right-2 bg-purple-600">{game.category}</Badge>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-1 text-white truncate">{game.title}</h3>
                    <div className="flex items-center text-xs text-gray-400 mb-1">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{game.playerCount.toLocaleString()}</span>
                      <Coins className="h-3 w-3 ml-2 mr-1" />
                      <span>{game.tokenSymbol}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(game.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                      ))}
                      <span className="ml-1 text-xs text-gray-400">{game.rating.toFixed(1)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" className="w-full text-xs">
                          Play Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">{game.title}</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div>
                            <Image
                              src={game.image}
                              alt={game.title}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <p className="mt-4 text-sm text-gray-300">{game.description}</p>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <Users className="h-5 w-5 mr-2 text-purple-400" />
                              <span>{game.playerCount.toLocaleString()} active players</span>
                            </div>
                            <div className="flex items-center">
                              <Coins className="h-5 w-5 mr-2 text-yellow-400" />
                              <span>Token: {game.tokenSymbol}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-5 w-5 mr-2 text-yellow-400" />
                              <span>Rating: {game.rating.toFixed(1)}</span>
                              <div className="ml-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`inline-block h-4 w-4 ${i < Math.floor(game.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                            <Button 
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => handleGameLaunch(game)}
                            >
                              <Gamepad2 className="mr-2 h-4 w-4" /> Launch Game
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
        </div>
      </main>
    </div>
  )
}
