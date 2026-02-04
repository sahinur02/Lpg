
import React from 'react';
import { User, Coin, Transaction, TransactionStatus } from '../types';

interface Props {
  user: User;
  setUser: (u: User) => void;
  coins: Coin[];
  onAddTransaction: (tx: Transaction) => void;
  onCoinClick: (coin: Coin) => void;
}

const InvestView: React.FC<Props> = ({ user, coins, onCoinClick }) => {
  // Explicitly cast Object.entries to [string, number][] to fix TS 'unknown' errors
  const holdings = (Object.entries(user.walletCrypto) as [string, number][]).filter(([_, qty]) => qty > 0);
  
  const calculateTotalValue = () => {
    return holdings.reduce((acc, [symbol, qty]) => {
      const coin = coins.find(c => c.symbol === symbol);
      // qty is now correctly inferred as number
      return acc + (coin ? coin.price * qty : 0);
    }, 0);
  };

  const totalValue = calculateTotalValue();
  const estimatedProfit = totalValue * 0.154; // Mock data for aesthetics

  return (
    <div className="flex flex-col min-h-full pb-6 p-6 space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Investments</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Wealth Portfolio Summary</p>
      </div>

      {/* Hero Summary Card */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100 flex flex-col space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invested Value</p>
            <h3 className="text-4xl font-black text-indigo-600 tracking-tight">₹{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">📈</div>
        </div>
        
        <div className="h-px bg-slate-50 w-full"></div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.15em]">Unrealized Profit</p>
            <p className="text-xl font-black text-emerald-500 mt-0.5">+₹{estimatedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-emerald-50 px-3 py-1.5 rounded-xl">
             <span className="text-[10px] font-black text-emerald-600">+15.42%</span>
          </div>
        </div>
      </div>

      {/* Holdings Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Asset Allocation</h3>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Rebalance</button>
        </div>
        
        <div className="space-y-4">
          {holdings.length > 0 ? holdings.map(([symbol, qty]) => {
            const coin = coins.find(c => c.symbol === symbol);
            // qty is number, so value is number
            const value = coin ? coin.price * qty : 0;
            const coinProfit = value * 0.082; // Mock

            return (
              <div 
                key={symbol} 
                onClick={() => coin && onCoinClick(coin)}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm hover:border-indigo-100 transition-all group cursor-pointer active:scale-98 transition-transform"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform overflow-hidden">
                    {coin?.icon.includes('data:image') || coin?.icon.startsWith('http') ? (
                      <img src={coin.icon} className="w-full h-full object-cover" alt={symbol} />
                    ) : (
                      coin?.icon || '🪙'
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm tracking-tight">{coin?.name || symbol}</h4>
                    {/* qty is number, toFixed(6) exists */}
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{qty.toFixed(6)} {symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-base text-slate-900">₹{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-0.5">+₹{coinProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            );
          }) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 space-y-6">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto opacity-50">💼</div>
               <div className="space-y-2">
                 <p className="text-slate-900 font-black text-sm uppercase tracking-wider">Empty Portfolio</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Discover assets in the market to begin</p>
               </div>
               <button className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-100 text-[10px] uppercase tracking-widest active:scale-95 transition-all">Go to Markets</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Added missing default export
export default InvestView;
