import React, { useState } from 'react';
import { BudgetItem } from '../types';
import { getBudgetStatus, formatCurrency } from '../utils/formatters';
import {
  Utensils,
  Home,
  ShoppingBag,
  ShoppingCart,
  Car,
  MoreVertical,
  AlertTriangle,
  PlusCircle,
  Pencil,
  Trash2,
  DollarSign,
} from 'lucide-react';

interface BudgetCardProps {
  item: BudgetItem;
  currency: string;
  onAddExpense: (budget: BudgetItem) => void;
  onEditBudget: (budget: BudgetItem) => void;
  onDeleteBudget: (budgetId: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  item,
  currency,
  onAddExpense,
  onEditBudget,
  onDeleteBudget,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const status = getBudgetStatus(item.spent, item.limit);

  // Map icon string to Lucide component safely
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'utensils':
      case 'dining':
      case 'restaurant':
        return <Utensils size={20} />;
      case 'home':
      case 'housing':
        return <Home size={20} />;
      case 'shopping-bag':
      case 'shopping':
        return <ShoppingBag size={20} />;
      case 'shopping-cart':
      case 'groceries':
        return <ShoppingCart size={20} />;
      case 'car':
      case 'transport':
      case 'transit':
        return <Car size={20} />;
      default:
        return <DollarSign size={20} />;
    }
  };

  // Icon background styling according to screenshot
  const getIconBg = () => {
    if (item.title === 'Dining Out' || status.isOver) {
      return 'bg-[#ffdad6] text-[#93000a]';
    }
    if (item.title === 'Housing') {
      return 'bg-[#6cf8bb] text-[#00714d]';
    }
    return 'bg-[#dce9ff] text-[#0b1c30]';
  };

  const percentage = Math.min(100, Math.round((item.spent / item.limit) * 100));

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 p-6 relative overflow-visible transition-all duration-200 hover:shadow-md group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${getIconBg()}`}
          >
            {getIcon(item.icon)}
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0B1C30] leading-tight">
              {item.title}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              {item.frequency}
            </span>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-[#0B1C30] p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Options"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 text-sm">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onAddExpense(item);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-100 transition-colors text-left font-medium"
                >
                  <PlusCircle size={15} className="text-emerald-600" />
                  Add Spending
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEditBudget(item);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-100 transition-colors text-left font-medium"
                >
                  <Pencil size={15} className="text-blue-600" />
                  Edit Budget
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteBudget(item.id);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 transition-colors text-left font-medium border-t border-slate-100 mt-1 pt-1.5"
                >
                  <Trash2 size={15} />
                  Delete Budget
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Figures */}
      <div className="flex justify-between items-end mb-2">
        <div className="font-bold text-2xl text-[#0B1C30]">
          {formatCurrency(item.spent, currency)}
          <span className="font-normal text-sm text-slate-500 ml-1">
            / {formatCurrency(item.limit, currency)}
          </span>
        </div>

        {/* Status Badge */}
        {status.isOver ? (
          <div className="text-xs text-red-600 font-bold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md animate-pulse">
            <AlertTriangle size={13} />
            {status.shortLabel}
          </div>
        ) : status.isWarning ? (
          <div className="text-xs text-red-600 font-bold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md">
            <AlertTriangle size={13} />
            {status.shortLabel}
          </div>
        ) : item.isFixed ? (
          <div className="text-xs text-slate-500 font-medium">Fixed</div>
        ) : (
          <div className="text-xs text-slate-500 font-medium">
            {status.shortLabel}
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-[#dce9ff]/60 rounded-full h-2.5 mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status.isOver
              ? 'bg-red-600'
              : status.isWarning
              ? 'bg-red-500'
              : item.title === 'Housing'
              ? 'bg-[#006c49]'
              : 'bg-[#000000]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
