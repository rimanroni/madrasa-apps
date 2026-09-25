import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { formatBengaliDate, toBengaliNumber } from '../utils/bengali';
import { ShieldAlert, Clock, User, FileText, CheckCircle2 } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useMaktab();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4 text-emerald-700" />
            <span>নিরাপত্তা, জবাবদিহিতা ও অডিট ট্রেইল</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            অডিট লগ ও সিস্টেম পরিবর্তন ইতিহাস
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রতিটি আর্থিক লেনদেন, রসিদ, সদস্য হালনাগাদ ও সেটিংস পরিবর্তনের স্বয়ংক্রিয় নিরীক্ষা রেকর্ড
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
          মোট রেকর্ড: {toBengaliNumber(auditLogs.length)} টি
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">সময় ও তারিখ</th>
                <th className="px-4 py-3">ব্যবহারকারী (User)</th>
                <th className="px-4 py-3">অ্যাকশন (Action)</th>
                <th className="px-4 py-3">বিভাগ / মডিউল</th>
                <th className="px-4 py-3">আইডি / রেফারেন্স</th>
                <th className="px-4 py-3">পরিবর্তনের বিস্তারিত বিবরণ</th>
                <th className="px-4 py-3">ডিভাইস / মাধ্যম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    কোনো অডিট লগ রেকর্ড নেই।
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap font-mono">
                      {formatBengaliDate(log.timestamp)}
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {log.user_name}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                      {log.entity}
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {log.entity_id}
                    </td>

                    <td className="px-4 py-3 text-slate-800 min-w-[240px]">
                      {log.details}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      {log.ip_device || 'Web Client'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
