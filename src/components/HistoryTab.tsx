import React, { useState } from 'react';
import { Transaction, BudgetItem } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Calendar,
} from 'lucide-react';

interface HistoryTabProps {
  transactions: Transaction[];
  budgets: BudgetItem[];
  currency: string;
  onOpenAddExpense: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  transactions,
  budgets,
  currency,
  onOpenAddExpense,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.category && tx.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || tx.category === selectedCategory;

    const matchesType =
      selectedType === 'all' || tx.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort transactions
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'highest') {
      return b.amount - a.amount;
    }
    if (sortBy === 'lowest') {
      return a.amount - b.amount;
    }
    return 0;
  });

  // CSV Export handler
  const handleExportCSV = () => {
    if (sorted.length === 0) return;
    const headers = 'ID,Date,Title,Type,Category,Amount,Notes\n';
    const rows = sorted
      .map(
        (t) =>
          `"${t.id}","${t.date}","${t.title.replace(/"/g, '""')}","${t.type}","${t.category}","${t.amount}","${(t.notes || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wealthtrace_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allCategories = Array.from(
    new Set([...budgets.map((b) => b.title), 'Income', 'General'])
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1C30]">
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit and export complete financial record statements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={onOpenAddExpense}
            className="px-4 py-2.5 bg-[#0B1C30] hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle size={15} /> Add Record
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00714d]"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00714d]"
          >
            <option value="all">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as 'all' | 'expense' | 'income')
            }
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00714d]"
          >
            <option value="all">All Types (Expenses & Income)</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest'
              )
            }
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00714d]"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="highest">Sort: Highest Amount</option>
            <option value="lowest">Sort: Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-semibold mb-2">No matching transactions found</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="text-xs text-[#00714d] underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Transaction</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sorted.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            tx.type === 'income'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-[#0B1C30]'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <ArrowDownLeft size={15} />
                          ) : (
                            <ArrowUpRight size={15} />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0B1C30]">
                            {tx.title}
                          </div>
                          {tx.notes && (
                            <div className="text-[11px] text-slate-400">
                              {tx.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                        {tx.category}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    <td
                      className={`p-4 text-right font-bold text-sm whitespace-nowrap ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-[#0B1C30]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete transaction "${tx.title}"?`
                            )
                          ) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
