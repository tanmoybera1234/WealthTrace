import React, { useState } from 'react';
import { BudgetItem, Transaction } from '../../types';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: BudgetItem[];
  preselectedBudget?: BudgetItem | null;
  onSaveTransaction: (
    tx: Omit<Transaction, 'id'>,
    budgetId?: string
  ) => void;
  currency: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  budgets,
  preselectedBudget,
  onSaveTransaction,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>(
    preselectedBudget?.id || (budgets[0]?.id ?? '')
  );
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentBudget = budgets.find((b) => b.id === selectedBudgetId);
  const numericAmount = parseFloat(amount) || 0;
  const projectSpent = currentBudget ? currentBudget.spent + numericAmount : 0;
  const isGoingOver =
    type === 'expense' &&
    currentBudget &&
    projectSpent > currentBudget.limit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    onSaveTransaction(
      {
        budgetId: type === 'expense' ? selectedBudgetId : undefined,
        title: title.trim(),
        amount: numericAmount,
        type,
        category: currentBudget?.title || (type === 'income' ? 'Income' : 'General'),
        date,
        notes: notes.trim(),
      },
      type === 'expense' ? selectedBudgetId : undefined
    );

    // Reset fields
    setTitle('');
    setAmount('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#0B1C30]">Record Transaction</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g., Grocery Store, Coffee, Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00714d]"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-[#0B1C30] focus:outline-none focus:ring-2 focus:ring-[#00714d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00714d]"
              />
            </div>
          </div>

          {type === 'expense' && budgets.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Budget Category
              </label>
              <select
                value={selectedBudgetId}
                onChange={(e) => setSelectedBudgetId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00714d]"
              >
                {budgets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({formatCurrency(b.spent, currency)} / {formatCurrency(b.limit, currency)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Over Budget Warning Indicator */}
          {isGoingOver && currentBudget && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-pulse">
              <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Over-Budget Notice</span>
                Adding {formatCurrency(numericAmount, currency)} will exceed the {currentBudget.title} limit ({formatCurrency(currentBudget.limit, currency)}) by {formatCurrency(projectSpent - currentBudget.limit, currency)}.
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00714d]"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                type === 'income'
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-[#0B1C30] hover:bg-slate-800 text-white'
              }`}
            >
              <CheckCircle2 size={16} /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
