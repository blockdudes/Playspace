"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-[#1F2128] text-white overflow-y-auto relative">
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 opacity-50" />
                </div>

                <div className="relative z-10 w-full">
                    <Button
                        variant="ghost"
                        className="fixed top-4 left-4 p-4 text-lg hover:bg-transparent hover:text-white hover:underline z-50"
                        onClick={() => router.push("/home")}
                    >
                        <ArrowLeft className="mr-2 w-6 h-6" />
                        <span>Go Back</span>
                    </Button>
                    {children}
                </div>
            </div>


        </>
    )
}