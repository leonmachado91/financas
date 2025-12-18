import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const MONTHS = [
  { name: 'NOV', income: 'R$ 1.010,00', expense: 'R$ 3.670,00', balance: 'R$ 2.660,00' },
  { name: 'DEZ', income: 'R$ 1.010,00', expense: 'R$ 3.670,00', balance: 'R$ 2.660,00' },
  { name: 'JAN', income: 'R$ 1.010,00', expense: 'R$ 3.670,00', balance: 'R$ 2.660,00' },
  { name: 'FEV', income: 'R$ 1.010,00', expense: 'R$ 3.670,00', balance: 'R$ 2.660,00' },
  { name: 'MAR', income: 'R$ 1.010,00', expense: 'R$ 3.670,00', balance: 'R$ 2.660,00' },
];

export function MonthSelector() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with JAN

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < MONTHS.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="relative w-full flex items-center justify-between py-8 p-[0px]">
      <button 
        onClick={handlePrev}
        disabled={activeIndex === 0}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-20 transition-colors text-[16px]"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div className="flex-1 flex items-center justify-center gap-4 overflow-hidden px-[0px] py-[45px]">
        {MONTHS.map((month, index) => {
          const isActive = index === activeIndex;
          const isAdjacent = Math.abs(index - activeIndex) === 1;
          
          if (Math.abs(index - activeIndex) > 2) return null; // Hide distant items

          return (
            <div 
              key={index}
              className={cn(
                "transition-all duration-300 ease-out rounded-2xl p-6 flex flex-col items-center min-w-[200px]",
                isActive 
                  ? "bg-[#1A2C21] border border-green-500/20 scale-110 z-10 shadow-[0_0_30px_rgba(74,222,128,0.1)]" 
                  : "bg-transparent opacity-40 scale-90 grayscale blur-[1px]"
              )}
            >
              <div className={cn(
                "mb-2 rounded-full p-1",
                isActive ? "bg-green-500 text-black" : "bg-transparent text-gray-500"
              )}>
                {index % 2 === 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </div>
              
              <h3 className={cn(
                "font-black text-gray-200 mb-3",
                isActive ? "text-4xl" : "text-2xl"
              )}>{month.name}</h3>
              
              <div className="flex gap-3 text-[10px] font-bold mb-2 opacity-80">
                <span className="text-red-400 font-medium">{month.income}</span>
                <span className="text-green-400 font-medium">{month.expense}</span>
              </div>
              
              <div className={cn(
                "font-black tracking-tight",
                isActive ? "text-3xl text-green-500" : "text-xl text-gray-600"
              )}>
                {month.balance}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={handleNext}
        disabled={activeIndex === MONTHS.length - 1}
        className="p-2 text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}
