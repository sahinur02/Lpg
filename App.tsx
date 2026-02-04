
import React, { useState, useEffect } from 'react';
import { User, Coin, Transaction, TransactionStatus, KYCStatus, AppSettings } from './types';
import { MOCK_USER, INITIAL_COINS } from './constants';
import UserDashboard from './views/UserDashboard';
import Trade from './views/Trade';
import Wallet from './views/Wallet';
import Profile from './views/Profile';
import Auth from './views/Auth';
import KYC from './views/KYC';
import AdminPanel from './views/AdminPanel';
import Navigation from './components/Navigation';
import MarketView from './views/Market';
import InvestView from './views/Invest';
import CoinDetail from './views/CoinDetail';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [viewingCoin, setViewingCoin] = useState<Coin | null>(null);
  const [coins, setCoins] = useState<Coin[]>(INITIAL_COINS);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appLogo: 'https://cdn-icons-png.flaticon.com/512/825/825540.png',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    depositPaymentLink: 'https://razorpay.me/@IconicLtd'
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx1', userId: 'user_123', type: 'DEPOSIT', asset: 'INR', amount: 10000, currency: 'INR', status: TransactionStatus.SUCCESS, date: new Date().toISOString() },
    { id: 'tx2', userId: 'user_123', type: 'BUY', asset: 'BTC', amount: 0.002, currency: 'CRYPTO', status: TransactionStatus.SUCCESS, date: new Date().toISOString() }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev.map(c => ({
        ...c,
        price: c.price * (1 + (Math.random() * 0.005 - 0.0025))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);
  const handleAddTransaction = (tx: Transaction) => setTransactions([tx, ...transactions]);

  if (!user) {
    return <Auth onLogin={handleLogin} appLogo={appSettings.appLogo} />;
  }

  if (isAdminMode) {
    return (
      <AdminPanel 
        onClose={() => setIsAdminMode(false)} 
        coins={coins} 
        setCoins={setCoins}
        settings={appSettings}
        setAppSettings={setAppSettings}
        transactions={transactions} 
      />
    );
  }

  if (viewingCoin) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl">
        <CoinDetail 
          coin={viewingCoin} 
          user={user} 
          setUser={setUser} 
          onAddTransaction={handleAddTransaction} 
          onClose={() => setViewingCoin(null)} 
        />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <UserDashboard user={user} coins={coins} transactions={transactions} onAdminToggle={() => setIsAdminMode(true)} onProfileClick={() => setCurrentView('profile')} onCoinClick={setViewingCoin} onNavigate={setCurrentView} />;
      case 'invest':
        return <InvestView user={user} setUser={setUser} coins={coins} onAddTransaction={handleAddTransaction} onCoinClick={setViewingCoin} />;
      case 'market':
        return <MarketView user={user} setUser={setUser} coins={coins} onAddTransaction={handleAddTransaction} onCoinClick={setViewingCoin} />;
      case 'trade':
        return <Trade user={user} setUser={setUser} coins={coins} onTrade={handleAddTransaction} />;
      case 'wallet':
        return <Wallet user={user} setUser={setUser} transactions={transactions} setTransactions={setTransactions} onAddBank={() => setCurrentView('profile')} onCoinClick={setViewingCoin} coins={coins} appSettings={appSettings} />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} onUpdateUser={setUser} />;
      case 'kyc':
        return <KYC user={user} onComplete={(status) => { setUser({ ...user, kycStatus: status }); setCurrentView('profile'); }} />;
      default:
        return <UserDashboard user={user} coins={coins} transactions={transactions} onAdminToggle={() => setIsAdminMode(true)} onProfileClick={() => setCurrentView('profile')} onCoinClick={setViewingCoin} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar bg-slate-50">
        {renderView()}
      </div>
      <Navigation currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
