
import { Coin, KYCStatus, User } from './types';

export const MOCK_USER: User = {
  id: 'user_123',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 9876543210',
  kycStatus: KYCStatus.NOT_STARTED,
  walletINR: 50000,
  walletCrypto: {
    BTC: 0.045,
    ETH: 1.2,
    USDT: 500
  },
  referralCode: 'CRYPTO100',
  referralEarnings: 1500,
  role: 'USER'
};

export const INITIAL_COINS: Coin[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 77664.5, change24h: -1.66, icon: '₿' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 224776, change24h: -7.27, icon: 'Ξ' },
  { id: '3', name: 'Solana', symbol: 'SOL', price: 8900, change24h: -3.25, icon: '◎' },
  { id: '4', name: 'Tether', symbol: 'USDT', price: 97.26, change24h: -0.86, icon: '₮' },
  { id: '5', name: 'Ripple', symbol: 'XRP', price: 135.40, change24h: -3.51, icon: '✕' },
  { id: '6', name: 'Monero', symbol: 'XMR', price: 35000, change24h: -9.08, icon: 'M' },
  { id: '7', name: 'Hype', symbol: 'HYPE', price: 2580, change24h: -2.81, icon: '⭐' },
];

export const NAV_ITEMS = [
  { label: 'Home', path: 'home', icon: '🏠' },
  { label: 'Invest', path: 'invest', icon: '📈' },
  { label: 'Markets', path: 'market', icon: '📊' },
  { label: 'F&O', path: 'trade', icon: '🏧' },
  { label: 'Portfolio', path: 'wallet', icon: '💼' },
];
