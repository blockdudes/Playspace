import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Gift, Target, Users, Zap, ChevronRight, Swords, Trophy, Gamepad2,
  DollarSign, ShoppingBag, CheckSquare, Package, Users2, LucideBitcoin,
  HelpCircle, HeadphonesIcon, TicketSlash, LucideWebhook, ShipWheelIcon,
  GamepadIcon,
  LucideSquareArrowUp
} from "lucide-react";
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-[#14151A]/80 backdrop-blur-md p-4 flex flex-col z-10">
      <div className="flex items-center mb-8">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse">PlaySpace</span>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="space-y-1">
          {[
            { name: "Mines", icon: TicketSlash, route: "/home/games/mines" },
            { name: "Slot Machine", icon: LucideWebhook, route: "/home/games/slotMachine" },
            { name: "Spin Board", icon: ShipWheelIcon, route: "/home/games/spinBoard" },
            { name: "Play To Earn", icon: LucideBitcoin, route: "/home/games/playToEarn" },
            { name: 'Register Games', icon: GamepadIcon, route: "/RegisterGame" },
            { name: 'Profile', icon: GamepadIcon, route: "/profile" },
            { name: "Referral program", icon: Users2, route: "/referral" },
            { name: "Swap", icon: LucideSquareArrowUp, route: "/Swap" },
            { name: "FAQ", icon: HelpCircle, route: "/faq" },
          ].map((item) => (
            <Button key={item.name} className="w-full bg-transparent justify-start text-gray-400 hover:text-white hover:bg-[#2A2C35] group"
              onClick={() => router.push(item.route)}
            >
              <item.icon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-3" />
              {item.name}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
};

export default Sidebar;
