// types.ts

export type AdminView = 'dashboard' | 'mapping' | 'settings';
export type UserView = 'dashboard' | 'profile' | 'subscriptions' | 'priceComparison' | 'analytics';

export type Theme = 'light' | 'dark';

export type UserRole = 'admin' | 'user';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface LookupDataPoint {
  date: string;
  success: number;
  failed: number;
}

export interface ManualMappingItem {
  id: string;
  unmatchedTitle: string;
  merchant: string;
  potentialSKU: string;
  confidence: number;
}

export enum ApiStatusEnum {
  OPERATIONAL = 'Operational',
  DEGRADED = 'Degraded',
  DOWN = 'Down',
}

export interface ApiHealth {
  name: string;
  status: ApiStatusEnum;
  responseTime: number;
}

export enum ActivityType {
  SUCCESS = 'success',
  RISK = 'risk',
  ERROR = 'error',
  INFO = 'info',
}

export interface ActivityLogItem {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}

export interface UserSavings {
    totalSavings: number;
    averageSavings: number;
    risksDetected: number;
    // FIX: Add optional 'savingsGoal' property to align with mock data and feature requirements.
    savingsGoal?: number;
}

export interface UserCheckoutActivity {
    id: string;
    date: string;
    merchant: string;
    items: number;
    savings: number;
}

export interface DetailedCheckoutItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface SavingsBreakdown {
    description: string;
    amount: number;
}

export interface DetailedCheckout {
    id: string;
    date: string;
    merchant: string;
    items: DetailedCheckoutItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    savings: number;
    savingsBreakdown: SavingsBreakdown[];
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    cycle: 'monthly' | 'yearly';
    nextPaymentDate: string;
}

export interface PriceComparisonMerchant {
    merchant: string;
    price: number;
    availability: 'In Stock' | 'Out of Stock' | 'Limited Stock';
    shipping: number;
    totalCost: number;
    rating?: number;
    estimatedDelivery?: string;
}

export interface PriceComparisonItem {
    id: string;
    productName: string;
    category: string;
    imageUrl?: string;
    merchants: PriceComparisonMerchant[];
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
}

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

// Analytics types
export interface SpendingTrend {
  month: string;
  spending: number;
  savings: number;
  transactions: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface MonthlyComparison {
  currentMonth: {
    spending: number;
    savings: number;
    transactions: number;
  };
  previousMonth: {
    spending: number;
    savings: number;
    transactions: number;
  };
  percentageChange: {
    spending: number;
    savings: number;
    transactions: number;
  };
}

export interface AnalyticsInsight {
  id: string;
  type: 'tip' | 'warning' | 'success' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: string;
}

export interface PredictiveAnalytics {
  nextMonthSpending: number;
  confidence: number;
  factors: string[];
  recommendation: string;
}