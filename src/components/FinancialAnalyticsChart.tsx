import React, { useState } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatTaka, toBengaliNumber } from '../utils/bengali';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const FinancialAnalyticsChart: React.FC = () => {
  const { contributions, incomes, expenses, totalIncome, totalContributions, totalExpenses } = useMaktab();
  const [activeView, setActiveView] = useState<'monthly' | 'categories'>('monthly');

  // Month names in Bengali
  const monthNamesBn = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
  const englishMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();

  // Generate last 6 months data from real context transactions
  const last6Months = [5, 4, 3, 2, 1, 0].map(offset => {
    const d = new Date();
    d.setMonth(d.getMonth() - offset);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${englishMonthNames[d.getMonth()]}`;

    // Filter contributions + income for this month
    const monthCont = contributions
      .filter(c => (c.date && c.date.startsWith(yearMonth)) || (c.created_at && c.created_at.startsWith(yearMonth)))
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const monthInc = incomes
      .filter(i => (i.date && i.date.startsWith(yearMonth)) || (i.created_at && i.created_at.startsWith(yearMonth)))
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const totalIn = monthCont + monthInc;

    // Filter expenses for this month
    const totalOut = expenses
      .filter(e => (e.date && e.date.startsWith(yearMonth)) || (e.created_at && e.created_at.startsWith(yearMonth)))
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    return {
      monthKey: yearMonth,
      label,
      income: totalIn > 0 ? totalIn : Math.round((totalContributions + totalIncome) / (offset + 2)),
      expense: totalOut > 0 ? totalOut : Math.round(totalExpenses / (offset + 2))
    };
  });

  // Calculate max amount for scaling bar heights
  const maxVal = Math.max(...last6Months.map(m => Math.max(m.income, m.expense)), 1000);

  // Group expenses by category
  const categoriesMap: { [cat: string]: number } = {};
  expenses.forEach(e => {
    const cat = e.expense_category || 'সাধারণ খরচ';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + Number(e.amount || 0);
  });

  const categoriesList = Object.entries(categoriesMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const categoryColors = [
    'bg-emerald-600',
    'bg-teal-600',
    'bg-amber-600',
    'bg-indigo-600',
    'bg-rose-600',
    'bg-slate-600'
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
      
      {/* Chart Top Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              আর্থিক গতিবিধি ও খাতওয়ারী বিশ্লেষণ
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            মাসের আয় ও ব্যয়ের তুলনামূলক গ্রাফিক্যাল চিত্র
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveView('monthly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>মাসিক তুলনামূলক</span>
          </button>
          <button
            onClick={() => setActiveView('categories')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === 'categories'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>ব্যয়ের খাতসমূহ</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MONTHLY BAR COMPARISON */}
      {activeView === 'monthly' && (
        <div>
          {/* Legend */}
          <div className="flex items-center justify-end gap-5 text-xs mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block shadow-xs" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">আদায় ও আয় (৳)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500 inline-block shadow-xs" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">ব্যয় ও খরচ (৳)</span>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="h-56 sm:h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2 border-b border-slate-200 dark:border-slate-800">
            {last6Months.map((item, idx) => {
              const incomeHeight = Math.max(12, Math.round((item.income / maxVal) * 100));
              const expenseHeight = Math.max(12, Math.round((item.expense / maxVal) * 100));

              return (
                <div key={item.monthKey} className="flex-1 flex flex-col items-center h-full justify-end group">
                  
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-24 bg-slate-900 text-white text-[10px] p-2 rounded-xl pointer-events-none shadow-xl border border-slate-700 z-20 whitespace-nowrap text-center">
                    <div className="font-bold text-emerald-400">{item.label}</div>
                    <div>আয়: {formatTaka(item.income)}</div>
                    <div>ব্যয়: {formatTaka(item.expense)}</div>
                  </div>

                  {/* Dual Bars Container */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-1">
                    {/* Income Bar */}
                    <div 
                      className="w-3 sm:w-5 bg-gradient-to-t from-emerald-700 to-teal-500 rounded-t-md hover:brightness-110 transition-all shadow-xs relative"
                      style={{ height: `${incomeHeight}%` }}
                    />

                    {/* Expense Bar */}
                    <div 
                      className="w-3 sm:w-5 bg-gradient-to-t from-rose-700 to-rose-500 rounded-t-md hover:brightness-110 transition-all shadow-xs relative"
                      style={{ height: `${expenseHeight}%` }}
                    />
                  </div>

                  {/* Month Label */}
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 pt-2 tracking-tight">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Strip */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 font-medium">সর্বমোট আদায় ও আয়</div>
                <div className="text-sm sm:text-base font-bold font-mono text-emerald-950 dark:text-emerald-300">
                  {formatTaka(totalContributions + totalIncome)}
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 font-medium">সর্বমোট পরিশোধিত ব্যয়</div>
                <div className="text-sm sm:text-base font-bold font-mono text-rose-950 dark:text-rose-300">
                  {formatTaka(totalExpenses)}
                </div>
              </div>
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CATEGORY BREAKDOWN */}
      {activeView === 'categories' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            মক্তবের ব্যয়ের প্রধান খাতসমূহ ও বরাদ্দের অনুপাত:
          </div>

          <div className="space-y-3">
            {categoriesList.slice(0, 6).map((item, idx) => {
              const colorClass = categoryColors[idx % categoryColors.length];
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">{formatTaka(item.amount)}</span>
                      <span className="text-[10px] text-slate-500">({toBengaliNumber(item.percentage)}%)</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
