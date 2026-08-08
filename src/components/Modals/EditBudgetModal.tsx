import React, { useState, useEffect } from 'react';
import { BudgetItem, Frequency } from '../../types';
import { X, Check } from 'lucide-react';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetItem | null;
  onSave: (updated: BudgetItem) => void;
  currency: string;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({
  isOpen,
  onClose,
  budget,
  onSave,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState('');
  const [spent, setSpent] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (budget) {
      setTitle(budget.title);
      setLimit(budget.limit.toString());
      setSpent(budget.spent.toString());
      setFrequency(budget.frequency);
      setIsFixed(budget.isFixed || false);
    }
  }, [budget]);

  if (!isOpen || !budget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    const numLimit = parseFloat(limit);
    const numSpent = parseFloat(spent);

    if (isNaN(numLimit) || numLimit < 0) {
      setError('Please enter a valid limit');
      return;
    }

    if (isNaN(numSpent) || numSpent < 0) {
      setError('Please enter a valid spent amount');
      return;
    }

    onSave({
      ...budget,
      title: title.trim(),
      limit: numLimit,
      spent: numSpent,
      frequency,
      isFixed,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#0B1C30]">
            Edit Budget: {budget.title}
          </h2>
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
              Budget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00714d]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Limit ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00714d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Spent ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00714d]"
              />
            </div>
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="editIsFixed"
              checked={isFixed}
              onChange={(e) => setIsFixed(e.target.checked)}
              className="w-4 h-4 text-[#00714d] rounded border-slate-300 focus:ring-[#00714d]"
            />
            <label htmlFor="editIsFixed" className="text-xs font-medium text-slate-700">
              Mark as Fixed Expense
            </label>
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
              className="flex-1 py-2.5 px-4 bg-[#0B1C30] hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
