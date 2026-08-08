import React from 'react';
import { BudgetItem } from '../types';
import { BudgetCard } from './BudgetCard';
import { formatCurrency, calculatePercentage } from '../utils/formatters';
import { TrendingUp, PlusCircle, AlertCircle } from 'lucide-react';

interface BudgetTabProps {
  budgets: BudgetItem[];
  totalMonthlyBudget: number;
  currency: string;
  onOpenCreateBudget: () => void;
  onAddExpense: (budget: BudgetItem) => void;
  onEditBudget: (budget: BudgetItem) => void;
  onDeleteBudget: (budgetId: string) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  budgets,
  totalMonthlyBudget,
  currency,
  onOpenCreateBudget,
  onAddExpense,
  onEditBudget,
  onDeleteBudget,
}) => {
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const spentPercentage = calculatePercentage(totalSpent, totalMonthlyBudget);
  const isOverallOver = totalSpent > totalMonthlyBudget;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Summary Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Monthly Budget */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 mb-2">
              Total Monthly Budget
            </h3>
            <div className="text-3xl md:text-4xl font-extrabold text-[#0B1C30] tracking-tight">
              {formatCurrency(totalMonthlyBudget, currency)}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#006c49]">
            <TrendingUp size={16} />
            <span>{isOverallOver ? 'Over budget limit' : 'On track'}</span>
          </div>
        </div>

        {/* Card 2: Total Spent */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 mb-2">
              Total Spent
            </h3>
            <div className="text-3xl md:text-4xl font-extrabold text-[#0B1C30] tracking-tight">
              {formatCurrency(totalSpent, currency)}
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-slate-500">
            {spentPercentage}% of total budget
          </div>
        </div>

        {/* Card 3: Create New Budget Button */}
        <button
          onClick={onOpenCreateBudget}
          className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border-2 border-dashed border-[#bec6e0] p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-slate-50 transition-all duration-200 group active:scale-98 min-h-[130px]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#6cf8bb] text-[#0B1C30] group-hover:text-[#00714d] flex items-center justify-center transition-colors mb-2">
            <PlusCircle size={24} />
          </div>
          <span className="text-sm font-bold text-[#0B1C30] group-hover:text-[#00714d]">
            Create New Budget
          </span>
        </button>
      </div>

      {/* Over Budget Banner Notice if total spent exceeds budget */}
      {isOverallOver && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-semibold animate-pulse">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <span>
            Attention: Total spending ({formatCurrency(totalSpent, currency)}) has exceeded your total monthly budget limit of {formatCurrency(totalMonthlyBudget, currency)} by {formatCurrency(totalSpent - totalMonthlyBudget, currency)}.
          </span>
        </div>
      )}

      {/* Active Budgets Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#0B1C30]">Active Budgets</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {budgets.length} Categories
          </span>
        </div>

        {budgets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm mb-4">No budget categories set up yet.</p>
            <button
              onClick={onOpenCreateBudget}
              className="px-4 py-2 bg-[#0B1C30] text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map((item) => (
              <BudgetCard
                key={item.id}
                item={item}
                currency={currency}
                onAddExpense={onAddExpense}
                onEditBudget={onEditBudget}
                onDeleteBudget={onDeleteBudget}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
