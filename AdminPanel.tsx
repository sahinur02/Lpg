
import React, { useState, useRef } from 'react';
import { Transaction, Coin, TransactionStatus, User, KYCStatus, AppSettings } from '../types';
import { MOCK_USER } from '../constants';

interface Props {
  onClose: () => void;
  coins: Coin[];
  setCoins: (coins: Coin[]) => void;
  settings: AppSettings;
  setAppSettings: (s: AppSettings) => void;
  transactions: Transaction[];
}

const AdminPanel: React.FC<Props> = ({ onClose, coins, setCoins, settings, setAppSettings, transactions: initialTransactions }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'USERS' | 'COINS' | 'SETTINGS'>('DASHBOARD');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Admin Data State
  const [mockUsers, setMockUsers] = useState<User[]>([
    { ...MOCK_USER, id: 'user_1', name: 'Rahul Sharma', email: 'rahul@example.com', walletINR: 50000 },
    { ...MOCK_USER, id: 'user_2', name: 'Priya Singh', email: 'priya@example.com', walletINR: 12500, kycStatus: KYCStatus.PENDING },
    { ...MOCK_USER, id: 'user_3', name: 'Amit Kumar', email: 'amit@example.com', walletINR: 0, kycStatus: KYCStatus.NOT_STARTED }
  ]);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddCoin, setShowAddCoin] = useState(false);
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null);
  const [newCoin, setNewCoin] = useState({ name: '', symbol: '', price: '', icon: '🪙' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_EMAIL = 'brokenmasum007@gmail.com';
    const ADMIN_PASS = '@Sahinur01';

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Access Denied. Admin credentials required.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing && editingCoin) {
          setEditingCoin({ ...editingCoin, icon: base64String });
        } else {
          setNewCoin({ ...newCoin, icon: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoin.name || !newCoin.symbol || !newCoin.price) return alert('Fill all fields');
    
    const coin: Coin = {
      id: `COIN_${Date.now()}`,
      name: newCoin.name,
      symbol: newCoin.symbol.toUpperCase(),
      price: parseFloat(newCoin.price),
      change24h: 0,
      icon: newCoin.icon
    };

    setCoins([...coins, coin]);
    setNewCoin({ name: '', symbol: '', price: '', icon: '🪙' });
    setShowAddCoin(false);
    alert('New coin added successfully!');
  };

  const handleUpdateCoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoin) return;
    setCoins(coins.map(c => c.id === editingCoin.id ? editingCoin : c));
    setEditingCoin(null);
    alert('Coin details updated live!');
  };

  const handleDeleteCoin = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coin? This cannot be undone.')) {
      setCoins(coins.filter(c => c.id !== id));
    }
  };

  const handleSettingsUpdate = (key: keyof AppSettings, value: string) => {
    setAppSettings({ ...settings, [key]: value });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl space-y-10">
          <div className="text-center space-y-4">
            <img src={settings.appLogo} className="w-20 h-20 mx-auto rounded-2xl shadow-2xl object-contain" alt="Logo" onError={(e) => (e.target as HTMLImageElement).src="https://cdn-icons-png.flaticon.com/512/825/825540.png"} />
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Verify credentials to proceed</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            {error && <p className="text-rose-500 text-[10px] font-black text-center uppercase">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95">Unlock Dashboard</button>
          </form>
          <button onClick={onClose} className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Return to App</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col sm:flex-row">
      {/* Navigation */}
      <div className="w-full sm:w-64 bg-slate-850 p-6 flex flex-col space-y-8 border-r border-slate-800">
        <div className="flex items-center space-x-3 mb-4">
          <img src={settings.appLogo} className="w-10 h-10 rounded-xl object-contain" alt="Logo" />
          <span className="font-black tracking-tight uppercase text-xs">Admin Dashboard</span>
        </div>
        <nav className="flex-1 space-y-2">
          {['DASHBOARD', 'USERS', 'COINS', 'SETTINGS'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`w-full text-left px-5 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button onClick={onClose} className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-rose-400">Exit Admin</button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black tracking-tight capitalize">{activeTab.toLowerCase()}</h2>
            {activeTab === 'COINS' && (
              <button 
                onClick={() => setShowAddCoin(true)}
                className="bg-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/10"
              >
                + Add New Coin
              </button>
            )}
          </div>

          {activeTab === 'DASHBOARD' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Users', val: mockUsers.length, icon: '👥' },
                { label: 'Total Coins', val: coins.length, icon: '🪙' },
                { label: 'Trade Volume', val: '₹1.2M', icon: '📈' },
                { label: 'Logo Set', val: settings.appLogo ? 'YES' : 'NO', icon: '🖼️' }
              ].map(s => (
                <div key={s.label} className="bg-slate-850 p-6 rounded-[2rem] border border-slate-800">
                  <span className="text-3xl block mb-4">{s.icon}</span>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black mt-1">{s.val}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'SETTINGS' && (
            <div className="bg-slate-850 p-8 rounded-[2.5rem] border border-slate-800 space-y-10">
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Branding Configuration</h3>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Global App Logo URL</label>
                  <div className="flex items-center space-x-6">
                    <input 
                      type="text" 
                      value={settings.appLogo} 
                      onChange={(e) => handleSettingsUpdate('appLogo', e.target.value)} 
                      placeholder="https://example.com/logo.png"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center p-2 border border-slate-700">
                      <img src={settings.appLogo} className="w-full h-full object-contain" alt="Preview" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-800 w-full"></div>

              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400">Payment Configuration</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deposit Payment Link (Razorpay)</label>
                    <input 
                      type="text" 
                      value={settings.depositPaymentLink} 
                      onChange={(e) => handleSettingsUpdate('depositPaymentLink', e.target.value)} 
                      placeholder="https://razorpay.me/@IconicLtd"
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                    <p className="text-[9px] text-slate-500 font-bold uppercase px-1">User will be redirected to this link for deposits.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COINS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coins.map(c => (
                <div key={c.id} className="bg-slate-850 p-6 rounded-[2rem] border border-slate-800 flex flex-col space-y-4 group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-3xl overflow-hidden">
                        {c.icon.includes('data:image') || c.icon.startsWith('http') ? (
                          <img src={c.icon} className="w-full h-full object-cover" alt={c.symbol} />
                        ) : (
                          c.icon
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-sm">{c.name}</h4>
                        <p className="font-mono text-indigo-400 text-[10px] uppercase">{c.symbol} • ₹{c.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingCoin(c)}
                        className="w-8 h-8 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center text-xs transition-colors"
                        title="Edit Coin"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteCoin(c.id)}
                        className="w-8 h-8 bg-slate-800 hover:bg-rose-600 rounded-lg flex items-center justify-center text-xs transition-colors"
                        title="Delete Coin"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Coin Modal */}
          {showAddCoin && (
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-6">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black tracking-tight">Add New Coin</h3>
                  <button onClick={() => setShowAddCoin(false)} className="text-slate-500 text-2xl">✕</button>
                </div>
                
                <form onSubmit={handleAddCoin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Coin Name</label>
                    <input type="text" value={newCoin.name} onChange={(e) => setNewCoin({...newCoin, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none" placeholder="Ethereum" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Symbol</label>
                    <input type="text" value={newCoin.symbol} onChange={(e) => setNewCoin({...newCoin, symbol: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none" placeholder="ETH" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Live Price (INR)</label>
                    <input type="number" value={newCoin.price} onChange={(e) => setNewCoin({...newCoin, price: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none" placeholder="240000" required />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Coin Logo (Direct Upload)</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 overflow-hidden text-2xl">
                        {newCoin.icon.includes('data:image') || newCoin.icon.startsWith('http') ? (
                          <img src={newCoin.icon} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          newCoin.icon
                        )}
                      </div>
                      <label className="flex-1 cursor-pointer">
                        <div className="bg-slate-800 border border-slate-700 border-dashed rounded-2xl p-4 text-center hover:bg-slate-750 transition-colors">
                          <span className="text-[10px] font-black uppercase text-slate-400">Choose Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
                        </div>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Or Use Emoji / URL</label>
                      <input type="text" value={newCoin.icon} onChange={(e) => setNewCoin({...newCoin, icon: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-sm font-bold outline-none" placeholder="🪙 or URL" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/10">Deploy Coin to Market</button>
                </form>
              </div>
            </div>
          )}

          {/* Edit Coin Modal */}
          {editingCoin && (
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-6">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black tracking-tight">Edit {editingCoin.name}</h3>
                  <button onClick={() => setEditingCoin(null)} className="text-slate-500 text-2xl">✕</button>
                </div>
                
                <form onSubmit={handleUpdateCoin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Coin Name</label>
                    <input type="text" value={editingCoin.name} onChange={(e) => setEditingCoin({...editingCoin, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Symbol</label>
                    <input type="text" value={editingCoin.symbol} onChange={(e) => setEditingCoin({...editingCoin, symbol: e.target.value.toUpperCase()})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price (INR)</label>
                    <input type="number" value={editingCoin.price} onChange={(e) => setEditingCoin({...editingCoin, price: parseFloat(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold outline-none" required />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Coin Logo (Direct Upload)</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 overflow-hidden text-2xl">
                        {editingCoin.icon.includes('data:image') || editingCoin.icon.startsWith('http') ? (
                          <img src={editingCoin.icon} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          editingCoin.icon
                        )}
                      </div>
                      <label className="flex-1 cursor-pointer">
                        <div className="bg-slate-800 border border-slate-700 border-dashed rounded-2xl p-4 text-center hover:bg-slate-750 transition-colors">
                          <span className="text-[10px] font-black uppercase text-slate-400">Change Logo Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
                        </div>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Or Set Emoji / URL</label>
                      <input type="text" value={editingCoin.icon} onChange={(e) => setEditingCoin({...editingCoin, icon: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-sm font-bold outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/10">Save Changes</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
