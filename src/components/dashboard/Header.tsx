"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppState } from '@/lib/appState';
import { Bell, ChevronDown } from 'lucide-react';

const profiles = [
    { id: 'Leonardo', name: 'Leonardo', initials: 'LE', color: 'bg-blue-500' },
    { id: 'Compartilhado', name: 'Compartilhado', initials: 'CO', color: 'bg-purple-500' },
] as const;

export function Header() {
    const { selectedProfile, setSelectedProfile } = useAppState();

    const currentProfile = profiles.find(p => p.id === selectedProfile) || profiles[0];

    return (
        <header className="h-20 w-full flex items-center justify-end px-8 gap-6 sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-sm">
            {/* Notificações */}
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Seletor de Perfil */}
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 pl-6 border-l border-gray-800 outline-none hover:opacity-80 transition-opacity">
                    <Avatar className={`h-10 w-10 border-2 border-white/20 ${currentProfile.color}`}>
                        <AvatarFallback className="bg-transparent text-white font-semibold">
                            {currentProfile.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-white">{currentProfile.name}</span>
                        <span className="text-xs text-gray-400">Perfil ativo</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1C1C1C] border-gray-800 text-white min-w-[180px]">
                    {profiles.map((profile) => (
                        <DropdownMenuItem
                            key={profile.id}
                            onClick={() => setSelectedProfile(profile.id)}
                            className="hover:bg-gray-800 cursor-pointer flex items-center gap-3"
                        >
                            <Avatar className={`h-8 w-8 ${profile.color}`}>
                                <AvatarFallback className="bg-transparent text-white text-xs font-semibold">
                                    {profile.initials}
                                </AvatarFallback>
                            </Avatar>
                            <span>{profile.name}</span>
                            {selectedProfile === profile.id && (
                                <span className="ml-auto text-green-500">✓</span>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
