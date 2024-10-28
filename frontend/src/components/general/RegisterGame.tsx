'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadImageToPinata } from '@/lib/utils'

export default function GameListingForm() {
    const [formData, setFormData] = useState({
        gameName: '',
        gameUrl: '',
        mode: 'play-to-win',
    })
    const [gameImageUrl, setGameImageUrl] = useState<string>('')

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setGameImageUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleModeChange = (mode: string) => {
        setFormData(prev => ({ ...prev, mode }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let imageUrl = gameImageUrl; 

        const imageFile = document.getElementById('gameImage') as HTMLInputElement;

        if (imageFile && imageFile.files && imageFile.files[0]) {
            imageUrl = await uploadImageToPinata(imageFile.files[0]);
        }

        const gameData = { ...formData, gameImage: imageUrl };
        console.log(gameData);
        toast({
            title: 'Game listed successfully',
            description: 'Game data: ' + JSON.stringify(gameData),
        });

    }

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-[#1F2128]">
            {/* Gradient Background */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 opacity-50" />
            </div>

            <div className="relative z-10 w-full max-w-3xl p-8 space-y-6 text-center">
                <h1 className="text-4xl font-bold text-white">List Your Game</h1>
                <p className="text-white/70 max-w-lg mx-auto">
                    Create an engaging listing for your game, where players can easily access and learn more about it. Fill out the form below to add your game to the platform!
                </p>

                <div className="flex flex-col lg:flex-row gap-8 mt-6">
                    {/* Form Section */}
                    <div className="w-full lg:w-2/3 p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-lg bg-white/10 border border-white/20">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="gameName" className="text-white">Game Name</Label>
                                <Input
                                    id="gameName"
                                    name="gameName"
                                    value={formData.gameName}
                                    onChange={handleInputChange}
                                    placeholder="My Awesome Game"
                                    className="bg-white/20 border-white/30 text-white !placeholder-white/50"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="gameUrl" className="text-white">Game URL (Iframe/IPFS)</Label>
                                <Input
                                    id="gameUrl"
                                    name="gameUrl"
                                    type="url"
                                    value={formData.gameUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/iframe"
                                    className="bg-white/20 border-white/30 text-white !placeholder-white/50"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="gameImage" className="text-white">Game Image</Label>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="w-16 h-16 border-2 border-white/50">
                                        <AvatarImage src={gameImageUrl} alt="Game Image" />
                                        <AvatarFallback className='bg-gradient-to-r from-gray-400 to-white'>GM</AvatarFallback>
                                    </Avatar>
                                    <Input
                                        id="gameImage"
                                        name="gameImage"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="bg-white/20 border-white/30 text-white file:text-white file:bg-white/20 file:border-white/30"
                                    />
                                </div>
                                <p className="text-white/80 text-sm mt-2">Upload a game image (optional).</p>
                            </div>
                            <div>
                                <Label htmlFor="mode" className="text-white">Game Mode</Label>
                                <Select onValueChange={handleModeChange} defaultValue={formData.mode}>
                                    <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder-white/50">
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="play-to-win">Play to Win</SelectItem>
                                        <SelectItem value="free">Free</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/50 transition duration-300 ease-in-out transform hover:scale-105">
                                List Game
                            </Button>
                        </form>
                    </div>

                    {/* Example Listing Preview */}
                    <div className="w-full lg:w-1/3 p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-lg bg-white/10 border border-white/20">
                        <h2 className="text-2xl font-semibold text-white mb-4">Game Preview</h2>
                        <hr className='border-white/50 py-8' />
                        <div className="flex flex-col items-center">
                            <Avatar className="w-24 h-24 mb-4 border-2 border-white/50">
                                <AvatarImage src={gameImageUrl || "/placeholder.svg"} alt="Game Preview" />
                                <AvatarFallback className="bg-gradient-to-r from-gray-400 to-white">GM</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold text-white">{formData.gameName || "My Awesome Game"}</h3>
                            <p className="text-white/70 text-sm mt-2">{formData.mode === 'play-to-win' ? "Play to Win" : "Free to Play"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
