'use client'
import { BackgroundGradientAnimation } from '@/components/ui/background'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router = useRouter();
  return (
    <div className="relative h-screen w-full overflow-hidden ">
      <BackgroundGradientAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl sm:text-7xl font-bold text-black mb-4">
          PlaySpace
        </h1>
        <p className="text-xl sm:text-2xl text-black mb-8">
          Play Games. Earn Money. It's That Simple.
        </p>
        <Button className="bg-white text-purple-700 hover:bg-purple-100 font-bold py-2 px-6 rounded-full text-lg"
          onClick={() => router.push('/home')}
        >
          Visit
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default page