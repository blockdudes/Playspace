'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { uploadImageToPinata } from '@/lib/utils'

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = avatarUrl; 

    const imageFileInput = document.getElementById('avatar') as HTMLInputElement;
    const file = imageFileInput.files ? imageFileInput.files[0] : null;

    if (file) {
      try {
        imageUrl = await uploadImageToPinata(file); 
        setAvatarUrl(imageUrl); 
      } catch (error) {
        console.error("Failed to upload image to Pinata:", error);
        toast({
          title: 'Error uploading image',
          description: 'Please try again.',
        });
        return; 
      }
    }

    const userData = { ...formData, avatar: imageUrl };
    console.log(userData);
    toast({
      title: 'User registered successfully',
      description: 'User data: ' + JSON.stringify(userData),
    });

  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-lg bg-white/10 border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">User Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-white">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="bg-white/20 border-white/30 text-white placeholder-white/50"
              required
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="johndoe"
              className="bg-white/20 border-white/30 text-white placeholder-white/50"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className="bg-white/20 border-white/30 text-white placeholder-white/50"
              required
            />
          </div>
          <div>
            <Label htmlFor="avatar" className="text-white">Avatar</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-white/50">
                <AvatarImage src={avatarUrl} alt="Avatar" />
                <AvatarFallback className='bg-gradient-to-r from-gray-400 to-white'>CN</AvatarFallback>
              </Avatar>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="bg-white/20 border-white/30 text-white file:text-white file:bg-white/20 file:border-white/30"
              />
            </div>
            <p className="text-white/80 text-sm mt-2">Upload an avatar image (optional).</p>
          </div>
          <Button type="submit" className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/50 transition duration-300 ease-in-out transform hover:scale-105">
            Register
          </Button>
        </form>
      </div>
    </div>
  )
}
