export type Frequency = 'Monthly' | 'Weekly' | 'Yearly';

export type TabType = 'home' | 'history' | 'budget' | 'analysis';

export interface BudgetItem {
  id: string;
  title: string;
  category: string;
  frequency: Frequency;
  limit: number;
  spent: number;
  icon: string; // Lucide icon or Material symbol name
  bgColor: string; // e.g., 'bg-red-100 text-red-600'
  isFixed?: boolean;
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  budgetId?: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string; // ISO format or YYYY-MM-DD
  notes?: string;
  tags?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'warning' | 'info' | 'alert' | 'success';
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  currency: string;
  monthlyGoal: number;
}
