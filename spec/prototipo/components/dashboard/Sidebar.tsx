import React from 'react';
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, Grid, CreditCard, Settings, LogOut } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="h-screen w-20 bg-[#1C1C1C] flex flex-col items-center py-6 border-r border-gray-800/50 fixed left-0 top-0 z-50">
      <div className="mb-10">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
          <LayoutDashboard className="text-white w-6 h-6" />
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        <button className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors relative group">
          <ArrowUpCircle className="w-6 h-6" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            Receitas
          </div>
        </button>
        
        <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors relative group">
          <ArrowDownCircle className="w-6 h-6" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            Despesas
          </div>
        </button>
        
        <button className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative group">
          <Grid className="w-6 h-6" />
           <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            Categorias
          </div>
        </button>
        
        <button className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative group">
          <CreditCard className="w-6 h-6" />
           <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            Cartões
          </div>
        </button>
      </nav>

      <div className="flex flex-col gap-6 w-full items-center">
        <button className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <button className="p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
