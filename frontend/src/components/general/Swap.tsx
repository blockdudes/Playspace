'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Settings, ArrowDownUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const tokens = [
  { symbol: 'ECL', name: 'Euclid', balance: '1.5', video: '/assets/eucl.mp4' },
  { symbol: 'Game', name: 'Game Coin', balance: '1000', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAGvRhdg1vaZyhkn5zzE7p35e70SUgv0TVCw&s' },
  { symbol: 'Arch', name: 'Arch', balance: '1000', logo: 'https://assets.coingecko.com/coins/images/30789/large/bxLJkEWw_400x400.jpg?1696529656' },
]

export default function SwapComponent() {
  const [inputToken, setInputToken] = useState(tokens[0])
  const [outputToken, setOutputToken] = useState(tokens[1])
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)

  useEffect(() => {
    if (inputAmount) {
      const calculatedOutput = (parseFloat(inputAmount) * 1.5).toFixed(6)
      setOutputAmount(calculatedOutput)
    } else {
      setOutputAmount('')
    }
  }, [inputAmount, inputToken, outputToken])

  const handleSwap = () => {
    setIsSwapping(true)
    setTimeout(() => {
      setIsSwapping(false)
      setInputAmount('')
      setOutputAmount('')
    }, 2000)
  }

  const TokenSelector = ({ token, setToken, label, excludeToken }: { token: any, setToken: any, label: string, excludeToken: any }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center justify-center bg-white/10 w-full rounded-lg backdrop-blur-md hover:bg-white/30 transition border border-white/30 shadow-lg">
          {token.video ? (
            <video src={token.video} autoPlay loop muted className="w-6 h-6 rounded-full mr-2" />
          ) : (
            <img src={token.logo} alt={token.name} className="w-6 h-6 rounded-full mr-2" />
          )}
          <span className="text-lg text-white font-medium">{token.symbol}</span>
          <ChevronDown className="h-4 w-4 ml-auto text-white opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 rounded-lg backdrop-blur-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border border-gray-600 shadow-2xl">
        <Label className="block mb-2 text-white/70 text-sm font-semibold">{label}</Label>
        <div className="space-y-2">
          {tokens
            .filter((t) => t.symbol !== excludeToken.symbol)
            .map((t) => (
              <Button
                key={t.symbol}
                variant="ghost"
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-700/40 transition"
                onClick={() => setToken(t)}
              >
                {t.video ? (
                  <video src={t.video} autoPlay loop muted className="w-6 h-6 rounded-full mr-2" />
                ) : (
                  <img src={t.logo} alt={t.name} className="w-6 h-6 rounded-full mr-2" />
                )}
                <span className="text-white font-medium">{t.symbol}</span>
                <span className="ml-auto text-sm text-gray-400">{t.balance}</span>
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="w-full max-w-lg mx-auto p-6 h-[80%] space-y-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white">Token Swap</h1>
        <p className="text-gray-400">Quickly and securely swap your favorite tokens</p>
      </div>

      {/* Swap Card */}
      <div className="p-4 rounded-lg bg-gray-900/70 border border-gray-700 shadow-lg">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-700">
            <Label htmlFor="input-amount" className="text-sm font-medium text-gray-400">You pay</Label>
            <div className="flex mt-2">
              <Input
                id="input-amount"
                type="number"
                placeholder="0.0"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="w-2/3 border-0 text-2xl font-semibold bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <TokenSelector token={inputToken} setToken={setInputToken} label="Input Token" excludeToken={outputToken} />
            </div>
            <div className="text-sm text-gray-400 mt-1">Balance: {inputToken.balance} {inputToken.symbol}</div>
          </div>

          <div className="flex justify-center my-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-gray-700 p-2 hover:bg-gray-600 transition"
              onClick={() => {
                if (inputToken.symbol !== outputToken.symbol) {
                  setInputToken(outputToken)
                  setOutputToken(inputToken)
                  setInputAmount(outputAmount)
                  setOutputAmount(inputAmount)
                }
              }}
            >
              <ArrowDownUp className="h-4 w-4 text-white" />
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-gray-700">
            <Label htmlFor="output-amount" className="text-sm font-medium text-gray-400">You receive</Label>
            <div className="flex mt-2">
              <Input
                id="output-amount"
                type="number"
                placeholder="0.0"
                value={outputAmount}
                readOnly
                className="w-2/3 border-0 text-2xl font-semibold bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              <TokenSelector token={outputToken} setToken={setOutputToken} label="Output Token" excludeToken={inputToken} />
            </div>
            <div className="text-sm text-gray-400 mt-1">Balance: {outputToken.balance} {outputToken.symbol}</div>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <Button
        className={cn(
          "w-full h-12 mt-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl",
          isSwapping ? "opacity-50 cursor-not-allowed" : "",
          (!inputAmount || inputAmount === '0' || inputToken.symbol === outputToken.symbol) ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "hover:opacity-90"
        )}
        onClick={handleSwap}
        disabled={!inputAmount || inputAmount === '0' || isSwapping || inputToken.symbol === outputToken.symbol}
      >
        {isSwapping ? "Swapping..." : (!inputAmount || inputAmount === '0') ? "Enter an amount" : inputToken.symbol === outputToken.symbol ? "Select different tokens" : "Swap"}
      </Button>
    </div>
  )
}
