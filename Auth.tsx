
import React, { useState, useEffect } from 'react';
import { MOCK_USER } from '../constants';
import { User, KYCStatus } from '../types';

interface Props {
  onLogin: (user: User) => void;
  appLogo: string;
}

type AuthStep = 'PHONE' | 'OTP' | 'PASSWORD';

const Auth: React.FC<Props> = ({ onLogin, appLogo }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return alert('Please enter a valid 10-digit mobile number');
    
    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) return alert('Please enter the 4-digit OTP');
    
    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('PASSWORD');
    }, 1000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) return alert('Password must be at least 4 characters');
    
    if (mode === 'SIGNUP') {
      if (!name) return alert('Please enter your full name');
      if (password !== confirmPassword) return alert('Passwords do not match');
    }

    setIsLoading(true);
    setTimeout(() => {
      const userData: User = {
        ...MOCK_USER,
        phone: phone,
        email: `${phone}@iconic.trade`,
        name: mode === 'LOGIN' ? (phone === '9876543210' ? 'Rahul Sharma' : 'Trader User') : name,
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        kycStatus: KYCStatus.NOT_STARTED,
        walletINR: 0,
        walletCrypto: {}
      };
      setIsLoading(false);
      onLogin(userData);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleForgotPassword = () => {
    alert("Password reset link has been sent to your registered mobile number.");
  };

  const resetFlow = () => {
    setStep('PHONE');
    setPhone('');
    setOtp(['', '', '', '']);
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-8 max-w-md mx-auto relative overflow-hidden">
      <div className="flex-1 flex flex-col justify-center space-y-10">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
            {logoError ? (
              <div className="w-24 h-24 mx-auto bg-indigo-600 rounded-[2.2rem] flex items-center justify-center text-4xl shadow-2xl relative z-10 text-white">⚡</div>
            ) : (
              <img 
                src={appLogo} 
                alt="Logo" 
                className="w-24 h-24 mx-auto relative z-10 drop-shadow-2xl rounded-[2.2rem] object-contain bg-white p-2"
                onError={() => setLogoError(true)}
              />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {step === 'PHONE' ? (mode === 'LOGIN' ? 'Secure Login' : 'Start Your Trading Journey') : 
               step === 'OTP' ? 'Verification Code' : 'Set Security Password'}
            </p>
          </div>
        </div>

        {step === 'PHONE' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
             {mode === 'SIGNUP' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">👤</span>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 pl-14 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all" 
                    placeholder="Enter full name" 
                    required 
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300">+91</span>
                <input 
                  type="tel" 
                  value={phone} 
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 pl-14 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all" 
                  placeholder="9876543210" 
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex justify-center items-center"
            >
              {isLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : 'GET OTP'}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleOtpSubmit} className="space-y-8">
            <div className="flex justify-between space-x-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="number"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center text-2xl font-black focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all"
                  placeholder="•"
                />
              ))}
            </div>
            <div className="text-center space-y-4">
               <button 
                type="button" 
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest"
                onClick={() => alert("OTP resent!")}
              >
                Resend Code
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex justify-center items-center"
              >
                {isLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : 'VERIFY OTP'}
              </button>
              <button 
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-slate-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Change Number
              </button>
            </div>
          </form>
        )}

        {step === 'PASSWORD' && (
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {mode === 'LOGIN' && (
                  <button type="button" onClick={handleForgotPassword} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 pl-14 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            {mode === 'SIGNUP' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">🛡️</span>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 pl-14 text-sm font-bold focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex justify-center items-center group relative overflow-hidden"
              >
                {isLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : <span className="text-sm uppercase tracking-widest">{mode === 'LOGIN' ? 'SECURE LOGIN' : 'CREATE ACCOUNT'}</span>}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="py-10 text-center">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => {
              setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
              resetFlow();
            }} 
            className="text-indigo-600 font-black ml-2 underline decoration-2 underline-offset-4"
          >
            {mode === 'LOGIN' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
      
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-50 rounded-full -z-10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-slate-100 rounded-full -z-10 blur-3xl opacity-50"></div>
    </div>
  );
};

export default Auth;
