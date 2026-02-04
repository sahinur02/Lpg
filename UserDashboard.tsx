
import React from 'react';
import { User, Coin, Transaction } from '../types';

interface Props {
  user: User;
  coins: Coin[];
  transactions: Transaction[];
  onAdminToggle: () => void;
  onProfileClick: () => void;
  onCoinClick: (coin: Coin) => void;
  onNavigate: (view: string) => void;
}

const UserDashboard: React.FC<Props> = ({ user, coins, transactions, onAdminToggle, onProfileClick, onCoinClick, onNavigate }) => {
  const recentTransactions = transactions.slice(0, 4);

  const quickActions = [
    { label: 'Deposit', icon: '📥', color: 'bg-emerald-50 text-emerald-600', view: 'wallet' },
    { label: 'Withdraw', icon: '📤', color: 'bg-amber-50 text-amber-600', view: 'wallet' },
    { label: 'Refer', icon: '🎁', color: 'bg-indigo-50 text-indigo-600', view: 'profile' },
    { label: 'Orders', icon: '📜', color: 'bg-slate-50 text-slate-600', view: 'trade' }
  ];

  const handleActivityClick = (tx: Transaction) => {
    if (['BUY', 'SELL'].includes(tx.type)) {
      const coin = coins.find(c => c.symbol === tx.asset);
      if (coin) onCoinClick(coin);
    } else if (['DEPOSIT', 'WITHDRAWAL'].includes(tx.type)) {
      onNavigate('wallet');
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-6">
      <div className="p-6 pb-2 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onProfileClick}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dashboard</h1>
            <h2 className="text-base font-black text-slate-900 leading-tight">Hi, {user.name} 👋</h2>
          </div>
        </div>
        <button 
          onClick={onAdminToggle}
          className="w-10 h-10 bg-white border border-slate-100 flex items-center justify-center rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <span className="text-lg">⚙️</span>
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Total Net Worth</p>
              <h3 className="text-4xl font-black mt-1 tracking-tight">₹{user.walletINR.toLocaleString()}</h3>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-2 border border-white/10">
                <span className="text-[10px] font-black text-emerald-400">↑ 14.2%</span>
                <span className="text-[10px] font-bold text-indigo-100 opacity-60">24h Change</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="px-6 py-4 grid grid-cols-4 gap-4">
        {quickActions.map(item => (
          <div key={item.label} onClick={() => onNavigate(item.view)} className="flex flex-col items-center space-y-2 cursor-pointer group">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-transparent group-hover:border-current group-hover:scale-105 transition-all`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-6 mt-4 space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Top Movers</h3>
          <button onClick={() => onNavigate('market')} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Market Hub ›</button>
        </div>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          {coins.slice(0, 4).map(coin => (
            <div key={coin.id} onClick={() => onCoinClick(coin)} className="min-w-[120px] bg-white border border-slate-100 p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-95 transition-transform">
              <span className="text-xl mb-2 block">{coin.icon.length > 2 ? <img src={coin.icon} className="w-6 h-6 object-contain inline" /> : coin.icon}</span>
              <p className="text-[10px] font-black text-slate-400 uppercase">{coin.symbol}</p>
              <p className="text-xs font-black text-slate-900 mt-0.5">₹{coin.price.toLocaleString()}</p>
              <span className={`text-[9px] font-bold ${coin.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{coin.change24h}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mt-8 space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {recentTransactions.map(tx => (
            <div key={tx.id} onClick={() => handleActivityClick(tx)} className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border border-slate-50 hover:border-indigo-100 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${tx.type === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>{tx.type === 'DEPOSIT' ? '💰' : '🛒'}</div>
                <div><h4 className="font-black text-slate-900 text-xs">{tx.type} {tx.asset !== 'INR' ? tx.asset : ''}</h4><p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{new Date(tx.date).toLocaleDateString()}</p></div>
              </div>
              <div className="text-right"><p className={`font-black text-xs ${['DEPOSIT', 'SELL'].includes(tx.type) ? 'text-emerald-500' : 'text-slate-900'}`}>{tx.amount.toLocaleString()} {tx.asset !== 'INR' ? tx.asset : ''}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
