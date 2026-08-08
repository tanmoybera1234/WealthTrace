import React, { useState } from 'react';
import { BudgetItem, Frequency } from '../../types';
import { X, PlusCircle } from 'lucide-react';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBudget: Omit<BudgetItem, 'id' | 'createdAt'>) => void;
  currency: string;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState('shopping-bag');
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Budget title is required');
      return;
    }

    const numericLimit = parseFloat(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
      setError('Please enter a valid limit amount greater than 0');
      return;
    }

    onSave({
      title: title.trim(),
      category: category.trim() || 'General',
      frequency,
      limit: numericLimit,
      spent: 0,
      icon,
      bgColor: 'bg-blue-100 text-blue-700',
      isFixed,
    });

    // Reset fields
    setTitle('');
    setLimit('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#0B1C30]">Create New Budget</h2>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Budget Name
            </label>
            <input
              type="text"
              placeholder="e.g., Dining Out, Utilities"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00714d] focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Limit ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="500.00"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00714d] focus:border-transparent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00714d]"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category Icon
            </label>
            <div className="flex gap-2">
              {[
                { id: 'utensils', label: 'Food' },
                { id: 'home', label: 'Home' },
                { id: 'shopping-bag', label: 'Shop' },
                { id: 'shopping-cart', label: 'Groceries' },
                { id: 'car', label: 'Travel' },
              ].map((ic) => (
                <button
                  type="button"
                  key={ic.id}
                  onClick={() => setIcon(ic.id)}
                  className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold border transition-colors ${
                    icon === ic.id
                      ? 'bg-[#00714d] text-white border-[#00714d]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFixed"
              checked={isFixed}
              onChange={(e) => setIsFixed(e.target.checked)}
              className="w-4 h-4 text-[#00714d] rounded border-slate-300 focus:ring-[#00714d]"
            />
            <label htmlFor="isFixed" className="text-xs font-medium text-slate-700">
              Fixed Recurring Expense (e.g., Rent, Subscription)
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-[#0B1C30] hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PlusCircle size={16} /> Create Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
