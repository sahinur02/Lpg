
import React, { useState } from 'react';
import { User, Coin, Transaction, TransactionStatus } from '../types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  user: User;
  setUser: (u: User) => void;
  coins: Coin[];
  onAddTransaction: (tx: Transaction) => void;
  onCoinClick: (coin: Coin) => void;
}

const MarketView: React.FC<Props> = ({ user, setUser, coins, onAddTransaction, onCoinClick }) => {
  const [search, setSearch] = useState('');

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const getSparklineData = (price: number, change: number) => {
    const points = [];
    let current = price / (1 + change / 100);
    for (let i = 0; i < 10; i++) {
      points.push({ val: current + (Math.random() - 0.5) * (price * 0.02) });
      current += (price - current) / 10;
    }
    points.push({ val: price });
    return points;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Live Markets</h2>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Real-time crypto trends</p>
      </div>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or symbol..."
          className="w-full bg-white border border-slate-100 rounded-2xl p-4 pl-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-3 pb-4">
        {filteredCoins.map(coin => (
          <div 
            key={coin.id} 
            className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer group active:scale-98 transition-transform" 
            onClick={() => onCoinClick(coin)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors overflow-hidden">
                {coin.icon.includes('data:image') || coin.icon.startsWith('http') ? (
                  <img src={coin.icon} className="w-full h-full object-cover" alt={coin.symbol} />
                ) : (
                  coin.icon
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{coin.name}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-black">{coin.symbol}</p>
              </div>
            </div>
            
            <div className="flex-1 px-4 h-10 max-w-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSparklineData(coin.price, coin.change24h)}>
                  <Line type="monotone" dataKey="val" stroke={coin.change24h >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-900 text-sm">₹{coin.price.toLocaleString()}</p>
              <p className={`text-[10px] font-bold ${coin.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketView;
