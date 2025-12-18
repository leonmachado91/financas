import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function Header() {
  return (
    <header className="h-20 w-full flex items-center justify-end px-8 gap-6 sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-sm">
      <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
        <Avatar className="h-10 w-10 border-2 border-pink-500/50">
          <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="Leon Machado" />
          <AvatarFallback>LM</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Leon Machado</span>
          <span className="text-xs text-gray-400">Product Manager</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
      </div>
    </header>
  );
}
