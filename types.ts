
export enum KYCStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NOT_STARTED = 'NOT_STARTED'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export type MarginMode = 'Isolated' | 'Cross';
export type OrderSide = 'LONG' | 'SHORT';

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface AppSettings {
  appLogo: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  depositPaymentLink: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: KYCStatus;
  walletINR: number;
  walletCrypto: { [key: string]: number };
  referralCode: string;
  referralEarnings: number;
  role: 'USER' | 'ADMIN';
  bankDetails?: BankDetails;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BUY' | 'SELL' | 'LONG' | 'SHORT';
  asset: string;
  amount: number;
  currency: 'INR' | 'CRYPTO';
  status: TransactionStatus;
  date: string;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
}
