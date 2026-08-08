import React from 'react';
import { BudgetItem, Transaction, UserProfile } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  Sparkles,
  ChevronRight,
  ReceiptText,
  AlertTriangle,
} from 'lucide-react';

interface HomeTabProps {
  user: UserProfile;
  budgets: BudgetItem[];
  transactions: Transaction[];
  currency: string;
  onOpenAddExpense: () => void;
  onGoToTab: (tab: 'history' | 'budget' | 'analysis') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  budgets,
  transactions,
  currency,
  onOpenAddExpense,
  onGoToTab,
}) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const recentTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  const overBudgets = budgets.filter((b) => b.spent > b.limit);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Welcome & Financial Overview Hero */}
      <div className="bg-gradient-to-r from-[#0B1C30] via-[#131b2e] to-[#213145] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-3 backdrop-blur-md">
              <Sparkles size={14} /> Smart Wealth Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good day, {user.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-md">
              Here is your net monthly financial summary and category tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenAddExpense}
              className="px-5 py-3 bg-[#6cf8bb] hover:bg-[#4edea3] text-[#002113] rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} /> Record Expense
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Total Income
            </span>
            <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowDownLeft size={18} />
              {formatCurrency(totalIncome, currency)}
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="text-xl font-extrabold text-red-400 flex items-center gap-1 mt-1">
              <ArrowUpRight size={18} />
              {formatCurrency(totalExpense, currency)}
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Net Balance
            </span>
            <div className="text-xl font-extrabold text-white flex items-center gap-1 mt-1">
              <TrendingUp size={18} className="text-[#6cf8bb]" />
              {formatCurrency(netSavings, currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Warning banner if any budget category is exceeded */}
      {overBudgets.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 text-red-700 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600 shrink-0" />
            <span>
              {overBudgets.length} budget category is exceeding limits ({overBudgets.map((b) => b.title).join(', ')}).
            </span>
          </div>
          <button
            onClick={() => onGoToTab('budget')}
            className="text-red-700 underline hover:text-red-900 font-bold shrink-0"
          >
            Manage Budgets
          </button>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0B1C30]">Recent Activity</h2>
            <button
              onClick={() => onGoToTab('history')}
              className="text-xs font-bold text-[#00714d] hover:underline flex items-center gap-1"
            >
              View History <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 divide-y divide-slate-100 overflow-hidden">
            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No recent transactions recorded yet.
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        tx.type === 'income'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-[#0B1C30]'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0B1C30]">
                        {tx.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {tx.category} • {formatDate(tx.date)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`font-bold text-sm ${
                      tx.type === 'income'
                        ? 'text-emerald-600'
                        : 'text-[#0B1C30]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount, currency)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Top Category Quick View */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0B1C30]">Budget Watch</h2>
            <button
              onClick={() => onGoToTab('budget')}
              className="text-xs font-bold text-[#00714d] hover:underline"
            >
              See All
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 p-5 space-y-4">
            {budgets.slice(0, 4).map((b) => {
              const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
              const isOver = b.spent > b.limit;
              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0B1C30]">{b.title}</span>
                    <span
                      className={`font-semibold ${
                        isOver ? 'text-red-600' : 'text-slate-500'
                      }`}
                    >
                      {formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isOver
                          ? 'bg-red-600'
                          : b.title === 'Housing'
                          ? 'bg-[#006c49]'
                          : 'bg-[#000000]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
