// /components/dashboard/RegisterPromptModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RegisterPromptModalProps {
  show: boolean;
  onClose: () => void;
}

const RegisterPromptModal: React.FC<RegisterPromptModalProps> = ({ show, onClose }) => {
  const router = useRouter();
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1F2128] p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Register to Play!</h2>
        <p className="text-gray-400 mb-6">Sign up to enjoy our full range of games and features.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/Register")} className="bg-green-500 hover:bg-green-600 mb-2">Continue</Button>
          <Button onClick={onClose} className="bg-[#2A2C35]/80 hover:bg-[#3A3C45]/80">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPromptModal;
