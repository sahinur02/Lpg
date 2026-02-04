
import React, { useState, useMemo } from 'react';
import { User, Coin, Transaction, TransactionStatus, MarginMode, OrderSide } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  user: User;
  setUser: (u: User) => void;
  coins: Coin[];
  onTrade: (tx: Transaction) => void;
}

const Trade: React.FC<Props> = ({ user, setUser, coins, onTrade }) => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(coins[0]);
  const [topTab, setTopTab] = useState<'INR Futures' | 'USDT Futures' | 'Options'>('INR Futures');
  const [viewTab, setViewTab] = useState<'Chart' | 'Stats' | 'Trades'>('Chart');
  const [tradeActionTab, setTradeActionTab] = useState<'Trade' | 'Positions' | 'Orders'>('Trade');
  
  const [side, setSide] = useState<OrderSide>('LONG');
  const [marginMode, setMarginMode] = useState<MarginMode>('Isolated');
  const [leverage, setLeverage] = useState('10x');
  const [orderType, setOrderType] = useState('Market');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('Market Price');

  const candleData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const isUp = Math.random() > 0.45;
      const base = 75000 + Math.random() * 5000;
      return {
        name: i,
        open: base,
        close: isUp ? base + 800 : base - 800,
        high: base + 1200,
        low: base - 1200,
        volume: Math.random() * 500,
        isUp
      };
    });
  }, [selectedCoin]);

  const handleExecuteTrade = () => {
    if (!selectedCoin) return;
    const amtInr = parseFloat(size);
    if (isNaN(amtInr) || amtInr <= 0) return alert('Please enter amount in INR');
    if (amtInr > user.walletINR) return alert('Insufficient INR balance');

    const cryptoAmount = amtInr / selectedCoin.price;
    
    const newTx: Transaction = {
      id: `${side}${Date.now()}`,
      userId: user.id,
      type: side === 'LONG' ? 'BUY' : 'SELL',
      asset: selectedCoin.symbol,
      amount: cryptoAmount,
      currency: 'CRYPTO',
      status: TransactionStatus.SUCCESS,
      date: new Date().toISOString()
    };

    onTrade(newTx);
    
    // Update User Balance
    const updatedCrypto = { ...user.walletCrypto };
    if (side === 'LONG') {
      updatedCrypto[selectedCoin.symbol] = (updatedCrypto[selectedCoin.symbol] || 0) + cryptoAmount;
      setUser({
        ...user,
        walletINR: user.walletINR - amtInr,
        walletCrypto: updatedCrypto
      });
      alert(`Long position of ${cryptoAmount.toFixed(6)} ${selectedCoin.symbol} (₹${amtInr}) opened!`);
    } else {
      // For shorting in this simple demo, we'll just alert. Real shorting involves margin.
      alert(`Short position of ${amtInr} INR placed (Demo only)`);
    }

    setSize('');
  };

  if (!selectedCoin) return null;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top Header Navigation */}
      <div className="px-4 pt-4 pb-2 flex justify-around border-b border-slate-50">
        {['INR Futures', 'USDT Futures', 'Options'].map(tab => (
          <button
            key={tab}
            onClick={() => setTopTab(tab as any)}
            className={`text-sm font-bold transition-colors pb-2 px-2 ${topTab === tab ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Coin Selector Bar */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="text-xl">☰</button>
          <div className="flex items-center space-x-2">
            <span className="text-orange-500 text-lg">{selectedCoin.icon}</span>
            <span className="font-bold text-slate-900">{selectedCoin.symbol} • USDT</span>
            <span className="text-slate-300">▼</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 text-xl cursor-pointer">⭐</span>
          <span className="text-slate-400 text-xl cursor-pointer">🔔</span>
        </div>
      </div>

      {/* Price Bar */}
      <div className="px-4 flex items-baseline space-x-2">
        <span className="text-xl font-bold">{selectedCoin.price.toLocaleString()}</span>
        <span className={`text-xs font-bold ${selectedCoin.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          ({selectedCoin.change24h}%)
        </span>
        <span className="text-slate-300 text-xs">≈ ₹{(selectedCoin.price * 97).toLocaleString()}</span>
      </div>

      {/* Sub-tabs (Chart, Stats, Trades) */}
      <div className="mt-4 px-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex space-x-6">
          {['Chart', 'Stats', 'Trades'].map(tab => (
            <button
              key={tab}
              onClick={() => setViewTab(tab as any)}
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${viewTab === tab ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 bg-white relative border-b border-slate-50">
        <div className="h-full w-full pt-8 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={candleData}>
              <XAxis dataKey="name" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Bar dataKey="volume">
                {candleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isUp ? '#10b981' : '#f43f5e'} opacity={0.3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trade Section */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="flex space-x-8 px-6 pt-4 border-b border-slate-50">
          {['Trade', 'Positions', 'Orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setTradeActionTab(tab as any)}
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${tradeActionTab === tab ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <select 
                value={marginMode}
                onChange={(e) => setMarginMode(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-bold appearance-none outline-none"
              >
                <option>Isolated</option>
                <option>Cross</option>
              </select>
              <select 
                 value={leverage}
                 onChange={(e) => setLeverage(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-bold appearance-none outline-none"
              >
                <option>1x</option>
                <option>10x</option>
                <option>50x</option>
              </select>
            </div>
          </div>

          <div className="flex border border-slate-100 rounded-xl overflow-hidden">
            <button 
              onClick={() => setSide('LONG')}
              className={`flex-1 py-3 font-bold transition-all ${side === 'LONG' ? 'bg-emerald-50 text-emerald-600 border-r border-slate-100' : 'bg-white text-slate-300 border-r border-slate-100'}`}
            >
              Long
            </button>
            <button 
              onClick={() => setSide('SHORT')}
              className={`flex-1 py-3 font-bold transition-all ${side === 'SHORT' ? 'bg-rose-50 text-rose-600' : 'bg-white text-slate-300'}`}
            >
              Short
            </button>
          </div>

          <div className="space-y-3">
            <select 
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold appearance-none outline-none"
            >
              <option>Market Price</option>
              <option>Limit Price</option>
            </select>

            <div className="relative">
              <input 
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Enter Amount in INR"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <span className="text-xs font-bold text-slate-400">INR</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleExecuteTrade}
            className={`w-full p-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${side === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'}`}
          >
            {side === 'LONG' ? 'Buy / Long' : 'Sell / Short'}
          </button>
          
          <div className="flex justify-between text-[10px] px-1 text-slate-400">
            <span>Available: ₹{user.walletINR.toLocaleString()}</span>
            <span>Max: ₹{user.walletINR.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
