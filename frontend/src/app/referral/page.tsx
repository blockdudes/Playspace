"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Send, Gamepad2 } from "lucide-react"

export default function Component() {
  const [emails, setEmails] = useState<string[]>(Array(10).fill(""))
  const [invitesSent, setInvitesSent] = useState(0)
  const [tokens, setTokens] = useState(0)

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const handleSendInvites = () => {
    const validEmails = emails.filter(email => email.includes("@"))
    setTimeout(() => { // Simulate sending delay
      setInvitesSent(validEmails.length)
      localStorage.setItem('invitesSent', validEmails.length.toString()); // Store in localStorage
      if (validEmails.length === 10) {
        setTokens(100); // Reward 100 tokens for inviting 10 friends
        localStorage.setItem('tokens', '100'); // Store tokens in localStorage
      }
    }, 2000); // 2 seconds delay
  }
  
  // Initialize state from localStorage
  useEffect(() => {
    const storedInvites = localStorage.getItem('invitesSent');
    const storedTokens = localStorage.getItem('tokens');
    if (storedInvites) setInvitesSent(parseInt(storedInvites));
    if (storedTokens) setTokens(parseInt(storedTokens));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/50 text-white backdrop-blur-md border-purple-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            Epic Gamer Referral
          </CardTitle>
          <CardDescription className="text-purple-200">
            Invite 10 friends and earn 100 gaming tokens!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emails.map((email, index) => (
              <Input
                key={index}
                type="email"
                placeholder={`Friend ${index + 1}'s email`}
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className="bg-purple-900/50 border-purple-500 placeholder-purple-300 text-white"
              />
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{invitesSent}/10 friends invited</span>
            </div>
            <Progress value={(invitesSent / 10) * 100} className="h-2 bg-purple-900" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <Button onClick={handleSendInvites} className="w-full bg-purple-600 hover:bg-purple-700">
            <Send className="mr-2 h-4 w-4" /> Send Invites
          </Button>
          <div className="flex items-center gap-2 text-xl font-bold">
            <Trophy className="text-yellow-400" />
            <span>{tokens} Tokens Earned</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}