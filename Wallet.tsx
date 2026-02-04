
import React, { useState } from 'react';
import { User, Transaction, TransactionStatus, Coin, AppSettings } from '../types';

interface Props {
  user: User;
  setUser: (u: User) => void;
  transactions: Transaction[];
  setTransactions: (txs: Transaction[]) => void;
  onAddBank: () => void;
  onCoinClick: (coin: Coin) => void;
  coins: Coin[];
  appSettings: AppSettings;
}

const Wallet: React.FC<Props> = ({ user, setUser, transactions, setTransactions, onAddBank, onCoinClick, coins, appSettings }) => {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDepositRedirect = () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 100) return alert('Minimum deposit is ₹100');
    
    setIsProcessing(true);
    
    // Redirect logic
    const paymentLink = appSettings.depositPaymentLink || 'https://razorpay.me/@IconicLtd';
    
    // Smooth transition message
    setTimeout(() => {
      window.location.href = paymentLink;
    }, 800);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    const minLimit = 1;
    const maxLimit = 50000;

    if (!amt || amt < minLimit) return alert(`Minimum withdrawal amount is ₹${minLimit}`);
    if (amt > maxLimit) return alert(`Daily withdrawal limit exceeded! Maximum is ₹${maxLimit}`);
    if (amt > user.walletINR) return alert('Insufficient balance in your wallet.');
    if (!user.bankDetails) return alert('Link your bank account first to withdraw.');
    
    const newTx: Transaction = {
      id: `WTH${Date.now()}`,
      userId: user.id,
      type: 'WITHDRAWAL',
      asset: 'INR',
      amount: amt,
      currency: 'INR',
      status: TransactionStatus.PENDING,
      date: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setUser({ ...user, walletINR: user.walletINR - amt });
    setAmount('');
    setShowWithdraw(false);
    alert('Withdrawal request submitted! Processing time: 2-24 hours.');
  };

  const handleTransactionClick = (tx: Transaction) => {
    const coin = coins.find(c => c.symbol === tx.asset);
    if (coin) onCoinClick(coin);
  };

  return (
    <div className="flex flex-col min-h-full pb-6 p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio</h2>
        <div className="bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Verified Wallet</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-50 flex flex-col items-center space-y-6 text-center relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Total Balance Available</p>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter">₹{user.walletINR.toLocaleString()}</h3>
        </div>
        
        <div className="flex w-full space-x-4 relative z-10">
          <button 
            onClick={() => setShowDeposit(true)}
            className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-xl">📥</span>
            <span>Deposit</span>
          </button>
          <button 
            onClick={() => setShowWithdraw(true)}
            className="flex-1 bg-slate-900 text-white font-black py-5 rounded-3xl shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-xl">📤</span>
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Transaction History</h3>
        </div>
        
        <div className="space-y-3">
          {transactions.length > 0 ? transactions.slice(0, 15).map(tx => (
            <div 
              key={tx.id} 
              onClick={() => handleTransactionClick(tx)}
              className={`bg-white p-5 rounded-[2rem] flex items-center justify-between border border-slate-100 shadow-sm transition-transform active:scale-95 cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                  tx.type === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-600' : 
                  tx.type === 'WITHDRAWAL' ? 'bg-amber-50 text-amber-600' : 
                  tx.type === 'BUY' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {tx.type === 'DEPOSIT' ? '💰' : tx.type === 'WITHDRAWAL' ? '🏦' : tx.type === 'BUY' ? '🛒' : '💸'}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{tx.type} {tx.asset !== 'INR' ? tx.asset : ''}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-base ${['DEPOSIT', 'SELL'].includes(tx.type) ? 'text-emerald-500' : 'text-slate-900'}`}>
                  {['DEPOSIT', 'SELL'].includes(tx.type) ? '+' : '-'}{tx.currency === 'INR' ? '₹' : ''}{tx.amount.toLocaleString()} {tx.currency === 'CRYPTO' ? tx.asset : ''}
                </p>
                <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${
                  tx.status === TransactionStatus.SUCCESS ? 'text-emerald-500' : 'text-amber-500'
                }`}>{tx.status}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">History is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Add Money</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Minimum Deposit ₹100</p>
              </div>
              <button onClick={() => setShowDeposit(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-xl text-slate-400">✕</button>
            </div>
            <div className="space-y-8">
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-3xl group-focus-within:text-indigo-600 transition-colors">₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 pl-14 text-4xl font-black outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all"
                  placeholder="100.00"
                  autoFocus
                />
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleDepositRedirect} 
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl active:scale-95 transition-all text-lg flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Proceed to Pay</span>
                  )}
                </button>
                <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Secure Checkout via Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Withdrawal</h3>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Minimum Withdrawal ₹1</p>
              </div>
              <button onClick={() => setShowWithdraw(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-xl text-slate-400">✕</button>
            </div>
            
            {!user.bankDetails ? (
              <div className="text-center space-y-8 py-4">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-4xl mx-auto">🏦</div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-slate-900">Link Bank Account</h4>
                  <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed">Safety first! Payouts require a verified bank account. This can only be linked once.</p>
                </div>
                <button 
                  onClick={() => { setShowWithdraw(false); onAddBank(); }}
                  className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-xl active:scale-95 transition-all"
                >
                  Configure Bank Details
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center space-x-5 relative group">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl border border-slate-100">🏦</div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-black text-slate-900 truncate">{user.bankDetails.bankName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">A/C: ****{user.bankDetails.accountNumber.slice(-4)}</p>
                   </div>
                </div>

                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-3xl group-focus-within:text-indigo-600 transition-colors">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 pl-14 text-4xl font-black outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all"
                    placeholder="1.00"
                  />
                </div>

                <div className="space-y-4">
                  <button onClick={handleWithdraw} className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-indigo-100 active:scale-95 transition-all text-lg">Send to Bank</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
