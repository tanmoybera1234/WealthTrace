import React from 'react';
import { BudgetItem, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, BarChart2, ShieldCheck, Zap } from 'lucide-react';

interface AnalysisTabProps {
  budgets: BudgetItem[];
  transactions: Transaction[];
  currency: string;
}

const COLORS = [
  '#006c49',
  '#3980f4',
  '#ba1a1a',
  '#0b1c30',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
];

export const AnalysisTab: React.FC<AnalysisTabProps> = ({
  budgets,
  transactions,
  currency,
}) => {
  // Pie chart data
  const pieData = budgets.map((b) => ({
    name: b.title,
    value: b.spent,
  }));

  // Bar chart data (Budget Limit vs Actual Spent)
  const barData = budgets.map((b) => ({
    category: b.title,
    Limit: b.limit,
    Spent: b.spent,
  }));

  // Calculate overall financial health score
  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const overCount = budgets.filter((b) => b.spent > b.limit).length;

  let healthScore = 100;
  if (totalSpent > totalLimit) healthScore -= 30;
  healthScore -= overCount * 15;
  healthScore = Math.max(20, Math.min(100, healthScore));

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0B1C30]">
          Financial Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Deep visual telemetry into spending velocity and category allocations.
        </p>
      </div>

      {/* Health Score Banner */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#6cf8bb] text-[#00714d] flex items-center justify-center font-extrabold text-2xl shadow-sm shrink-0">
            {healthScore}
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-[#0B1C30] text-lg">
              <ShieldCheck className="text-[#00714d]" size={20} />
              Financial Health Score
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {healthScore >= 80
                ? 'Excellent budget discipline. Keep up the disciplined spending!'
                : healthScore >= 50
                ? 'Moderate adherence. Watch out for categories near or over limits.'
                : 'Action required! Multiple budget limits have been breached.'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-center">
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase block">
              Categories
            </span>
            <span className="text-lg font-extrabold text-[#0B1C30]">
              {budgets.length}
            </span>
          </div>

          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase block">
              Over Limit
            </span>
            <span
              className={`text-lg font-extrabold ${
                overCount > 0 ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              {overCount}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Donut Distribution */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 p-6 flex flex-col">
          <div className="flex items-center gap-2 font-bold text-[#0B1C30] mb-4">
            <PieIcon size={18} className="text-[#3980f4]" />
            Expense Distribution by Category
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [
                    formatCurrency(val, currency),
                    'Spent',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-semibold text-slate-700 truncate">
                  {entry.name}:
                </span>
                <span className="font-bold text-[#0B1C30] ml-auto">
                  {formatCurrency(entry.value, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Budget Limit vs Spent Comparison Bar Chart */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-[#c6c6cd]/40 p-6 flex flex-col">
          <div className="flex items-center gap-2 font-bold text-[#0B1C30] mb-4">
            <BarChart2 size={18} className="text-[#006c49]" />
            Budget Target vs Actual Spending
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number) => [
                    formatCurrency(val, currency),
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Limit" fill="#dce9ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#0b1c30" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
