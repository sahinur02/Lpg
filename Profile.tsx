
import React, { useState } from 'react';
import { User, KYCStatus, BankDetails } from '../types';

interface Props {
  user: User;
  onLogout: () => void;
  onUpdateUser: (u: User) => void;
}

const Profile: React.FC<Props> = ({ user, onLogout, onUpdateUser }) => {
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState<BankDetails>(user.bankDetails || {
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.accountName || !bankForm.accountNumber || !bankForm.ifscCode) {
      return alert('Please fill all fields');
    }
    // Update logic: Once saved, it shouldn't be easily changeable (as requested)
    onUpdateUser({ ...user, bankDetails: bankForm });
    setShowBankModal(false);
    alert('Bank details linked securely! This can only be updated via support.');
  };

  return (
    <div className="p-6 pb-24 space-y-10">
      <div className="flex flex-col items-center space-y-6 pt-10">
        <div className="relative group">
          <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl shadow-indigo-100 border-4 border-white group-hover:scale-105 transition-transform duration-500">
            {user.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white w-10 h-10 rounded-2xl shadow-xl flex items-center justify-center border-2 border-indigo-50 text-xl">✨</div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{user.email}</p>
        </div>
      </div>

      {/* Account Status Card */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification</span>
            <p className="text-sm font-black text-slate-900">KYC Status</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
            user.kycStatus === KYCStatus.APPROVED ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
            user.kycStatus === KYCStatus.PENDING ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
          }`}>
            {user.kycStatus}
          </span>
        </div>
        <div className="h-px bg-slate-50 w-full"></div>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security</span>
            <p className="text-sm font-black text-slate-900">Mobile Auth</p>
          </div>
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Enabled</span>
        </div>
      </div>

      {/* Referral Hub Section */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h3 className="font-black text-xl tracking-tight">Referral Hub</h3>
            <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-80 leading-relaxed">Boost your earnings by inviting your network</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl flex justify-between items-center p-4 rounded-3xl border border-white/20 group">
            <span className="font-mono font-black tracking-[0.4em] text-lg ml-2">{user.referralCode}</span>
            <button className="text-[10px] font-black bg-white text-indigo-600 px-6 py-3 rounded-2xl uppercase tracking-widest shadow-lg active:scale-95 transition-all">Copy</button>
          </div>
          
          <div className="flex justify-between items-end pt-2">
            <div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Lifetime Rewards</p>
              <p className="text-3xl font-black tracking-tight">₹{user.referralEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 px-3 py-1.5 rounded-xl border border-white/10">
               <span className="text-[10px] font-black">History ›</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Settings & Config */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <button 
          onClick={() => !user.bankDetails && setShowBankModal(true)}
          disabled={!!user.bankDetails}
          className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left group"
        >
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏦</div>
            <div>
              <span className="font-black text-slate-900 text-sm tracking-tight block">Bank Account</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {user.bankDetails ? `${user.bankDetails.bankName} ••••${user.bankDetails.accountNumber.slice(-4)}` : 'Link Account (One-time)'}
              </span>
            </div>
          </div>
          {!user.bankDetails && <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Link ›</span>}
          {user.bankDetails && <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
        </button>
        
        <button className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-colors border-b border-slate-50 group text-left">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛡️</div>
            <div>
              <span className="font-black text-slate-900 text-sm tracking-tight block">Security & 2FA</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Biometric Protected</span>
            </div>
          </div>
          <span className="text-slate-300">›</span>
        </button>
        
        <button className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-colors group text-left">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📄</div>
            <div>
              <span className="font-black text-slate-900 text-sm tracking-tight block">Help & Support</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Available 24/7</span>
            </div>
          </div>
          <span className="text-slate-300">›</span>
        </button>
      </div>

      {/* Official Logout */}
      <div className="pt-4">
        <button 
          onClick={onLogout}
          className="w-full py-6 rounded-3xl border-2 border-slate-100 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all flex items-center justify-center space-x-3 shadow-sm active:scale-95"
        >
          <span>Logout Securely</span>
          <span className="text-lg">🚪</span>
        </button>
        <p className="text-center text-[9px] font-bold text-slate-300 mt-6 uppercase tracking-widest">Iconic Trade v2.5.0 • Powered by SecureChain</p>
      </div>

      {/* Bank Details Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Link Bank</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify for instant payouts</p>
              </div>
              <button onClick={() => setShowBankModal(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors text-xl">✕</button>
            </div>
            
            <form onSubmit={handleSaveBank} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                <input 
                  type="text"
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm({...bankForm, accountName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  placeholder="Rahul Sharma"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Name</label>
                <input 
                  type="text"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  placeholder="HDFC Bank / ICICI / SBI"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                <input 
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value.replace(/\D/g, '')})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  placeholder="0000 0000 0000 0000"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                <input 
                  type="text"
                  value={bankForm.ifscCode}
                  onChange={(e) => setBankForm({...bankForm, ifscCode: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                  placeholder="HDFC0001234"
                  required
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-indigo-100 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Confirm & Link
                </button>
                <p className="text-center text-[9px] font-bold text-rose-400 mt-4 uppercase tracking-[0.2em]">⚠ This action cannot be undone</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
