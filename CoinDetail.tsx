
import React, { useState, useMemo } from 'react';
import { User, Coin, Transaction, TransactionStatus } from '../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  coin: Coin;
  user: User;
  setUser: (u: User) => void;
  onAddTransaction: (tx: Transaction) => void;
  onClose: () => void;
}

const CoinDetail: React.FC<Props> = ({ coin, user, setUser, onAddTransaction, onClose }) => {
  const [tradeMode, setTradeMode] = useState<'BUY' | 'SELL' | null>(null);
  const [amount, setAmount] = useState('');

  // Generate simulated chart data
  const chartData = useMemo(() => {
    const points = [];
    let current = coin.price / (1 + coin.change24h / 100);
    const step = (coin.price - current) / 24;
    for (let i = 0; i < 24; i++) {
      const val = current + i * step + (Math.random() - 0.5) * (coin.price * 0.03);
      points.push({ time: `${i}:00`, price: val });
    }
    points.push({ time: 'Now', price: coin.price });
    return points;
  }, [coin.price, coin.change24h]);

  const handleTrade = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 1) return alert('Minimum trade amount is ₹1');

    if (tradeMode === 'BUY') {
      if (amt > user.walletINR) return alert('Insufficient INR balance');
      const cryptoQty = amt / coin.price;
      
      const tx: Transaction = {
        id: `BUY${Date.now()}`,
        userId: user.id,
        type: 'BUY',
        asset: coin.symbol,
        amount: cryptoQty,
        currency: 'CRYPTO',
        status: TransactionStatus.SUCCESS,
        date: new Date().toISOString()
      };

      onAddTransaction(tx);
      const updatedWallet = { ...user.walletCrypto };
      updatedWallet[coin.symbol] = (updatedWallet[coin.symbol] || 0) + cryptoQty;
      setUser({
        ...user,
        walletINR: user.walletINR - amt,
        walletCrypto: updatedWallet
      });
      alert(`Successfully bought ${cryptoQty.toFixed(6)} ${coin.symbol}`);
    } else if (tradeMode === 'SELL') {
      const userHoldings = user.walletCrypto[coin.symbol] || 0;
      const inrValue = amt;
      const cryptoNeeded = inrValue / coin.price;

      if (cryptoNeeded > userHoldings) return alert(`Insufficient ${coin.symbol} holdings to sell ₹${inrValue}`);

      const tx: Transaction = {
        id: `SELL${Date.now()}`,
        userId: user.id,
        type: 'SELL',
        asset: coin.symbol,
        amount: cryptoNeeded,
        currency: 'CRYPTO',
        status: TransactionStatus.SUCCESS,
        date: new Date().toISOString()
      };

      onAddTransaction(tx);
      const updatedWallet = { ...user.walletCrypto };
      updatedWallet[coin.symbol] = userHoldings - cryptoNeeded;
      setUser({
        ...user,
        walletINR: user.walletINR + inrValue,
        walletCrypto: updatedWallet
      });
      alert(`Successfully sold ${cryptoNeeded.toFixed(6)} ${coin.symbol} for ₹${inrValue}`);
    }

    setAmount('');
    setTradeMode(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{coin.name}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{coin.symbol} / INR</p>
        </div>
        <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">⭐</button>
      </div>

      {/* Price Section */}
      <div className="px-6 py-4 flex flex-col items-center">
        <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        <div className={`mt-2 px-3 py-1 rounded-full flex items-center space-x-2 border ${
          coin.change24h >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
        }`}>
          <span className="text-xs font-black">{coin.change24h >= 0 ? '+' : ''}{coin.change24h}%</span>
          <span className="text-[10px] font-bold opacity-60">Past 24h</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-64 mt-4 px-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={coin.change24h >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={coin.change24h >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={coin.change24h >= 0 ? '#10b981' : '#f43f5e'} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Timeframes */}
      <div className="flex justify-center space-x-4 px-6 mt-6">
        {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map(tf => (
          <button key={tf} className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${tf === '1D' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
            {tf}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 px-6 mt-8">
        <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Market Cap</p>
          <p className="text-xs font-black text-slate-900">₹142.5K Cr</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">24h Volume</p>
          <p className="text-xs font-black text-slate-900">₹8.2K Cr</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">24h High</p>
          <p className="text-xs font-black text-slate-900">₹{(coin.price * 1.05).toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-3xl space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">24h Low</p>
          <p className="text-xs font-black text-slate-900">₹{(coin.price * 0.94).toLocaleString()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto p-6 flex space-x-4 bg-white border-t border-slate-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setTradeMode('SELL')}
          className="flex-1 bg-white border-2 border-slate-100 text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-50 transition-colors active:scale-95 transition-transform"
        >
          Sell
        </button>
        <button 
          onClick={() => setTradeMode('BUY')}
          className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-colors active:scale-95 transition-transform"
        >
          Buy Now
        </button>
      </div>

      {/* Trade Modal Overlay */}
      {tradeMode && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{tradeMode === 'BUY' ? 'Buy' : 'Sell'} {coin.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Price: ₹{coin.price.toLocaleString()}</p>
              </div>
              <button onClick={() => setTradeMode(null)} className="text-slate-300 text-2xl">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-3xl group-focus-within:text-indigo-600 transition-colors">₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 pl-14 text-4xl font-black outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all"
                  placeholder="1.00"
                  autoFocus
                />
                <button 
                  onClick={() => setAmount(tradeMode === 'BUY' ? user.walletINR.toString() : ((user.walletCrypto[coin.symbol] || 0) * coin.price).toString())}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-indigo-50 uppercase tracking-widest"
                >
                  MAX
                </button>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Quantity</span>
                <span className="text-sm font-black text-indigo-600">
                  {amount ? (parseFloat(amount) / coin.price).toFixed(6) : '0'} {coin.symbol}
                </span>
              </div>

              <button 
                onClick={handleTrade}
                className={`w-full text-white font-black py-6 rounded-[2rem] shadow-2xl active:scale-95 transition-all text-lg ${
                  tradeMode === 'BUY' ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-slate-900 shadow-slate-200 hover:bg-slate-800'
                }`}
              >
                Confirm {tradeMode === 'BUY' ? 'Purchase' : 'Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinDetail;
