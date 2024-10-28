import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, DollarSign, Target, User } from "lucide-react";
import { useRouter } from "next/navigation";

const Header: React.FC<{ registered: boolean, walletConnected: boolean }> = ({ registered, walletConnected }) => {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center mb-6">
      <Tabs defaultValue="casino" className="w-[400px]">
        <TabsList className="bg-[#2A2C35]/80 backdrop-blur-sm">
          <TabsTrigger value="casino" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300">
            <DollarSign className="mr-2 h-4 w-4" />
            Casino
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#2A2C35]/80 backdrop-blur-sm hover:bg-[#3A3C45]/80">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="bg-blue-500 text-white">English</DropdownMenuItem>
            <DropdownMenuItem disabled>Español</DropdownMenuItem>
            <DropdownMenuItem disabled>Français</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#2A2C35]/80 backdrop-blur-sm hover:bg-[#3A3C45]/80">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!registered && <DropdownMenuItem onClick={() => router.push("/Register")}>Register</DropdownMenuItem>}
            {!walletConnected && <DropdownMenuItem onClick={() => { }}>Connect Wallet</DropdownMenuItem>}
            {walletConnected && <DropdownMenuItem onClick={() => { }}>Disconnect Wallet</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
