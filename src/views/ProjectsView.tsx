import React, { useState } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { Project } from '../types/database';
import { formatTaka, formatBengaliDate, toBengaliNumber, getProjectStatusBadge } from '../utils/bengali';
import { 
  FolderKanban, 
  Plus, 
  X, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  TrendingUp, 
  Edit3 
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, addProject, updateProject, currentUser, showToast } = useMaktab();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('200000');
  const [currentExpense, setCurrentExpense] = useState('0');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionDate, setCompletionDate] = useState('');
  const [status, setStatus] = useState<'running' | 'completed' | 'on_hold'>('running');
  const [responsiblePerson, setResponsiblePerson] = useState('');

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setBudget('100000');
    setCurrentExpense('0');
    setStartDate(new Date().toISOString().split('T')[0]);
    setCompletionDate('');
    setStatus('running');
    setResponsiblePerson('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description);
    setBudget(proj.budget.toString());
    setCurrentExpense(proj.current_expense.toString());
    setStartDate(proj.start_date);
    setCompletionDate(proj.expected_completion_date || '');
    setStatus(proj.status);
    setResponsiblePerson(proj.responsible_person);
    setIsModalOpen(true);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('প্রকল্পের নাম আবশ্যক', 'error');
      return;
    }
    const numBudget = parseFloat(budget) || 0;
    const numExpense = parseFloat(currentExpense) || 0;

    setIsSubmitting(true);
    let success = false;
    if (editingProject) {
      success = await updateProject({
        ...editingProject,
        name: name.trim(),
        description: description.trim(),
        budget: numBudget,
        current_expense: numExpense,
        start_date: startDate,
        expected_completion_date: completionDate,
        status,
        responsible_person: responsiblePerson.trim()
      });
    } else {
      success = await addProject({
        name: name.trim(),
        description: description.trim(),
        budget: numBudget,
        current_expense: numExpense,
        start_date: startDate,
        expected_completion_date: completionDate,
        status,
        responsible_person: responsiblePerson.trim()
      });
    }
    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <FolderKanban className="w-4 h-4 text-emerald-700" />
            <span>অবকাঠামো উন্নয়ন ও সংস্কার কার্যক্রম</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            চলমান ও সমাপ্ত প্রকল্পসমূহ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            মক্তবের ভবন সংস্কার, অজুখানা ও সামগ্রিক উন্নয়ন বাজেট এবং ব্যয়ের অগ্রগতি
          </p>
        </div>

        {currentUser.role !== 'normal_user' && (
          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্রকল্প যুক্ত করুন</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const progress = proj.budget > 0 
            ? Math.min(100, Math.round((proj.current_expense / proj.budget) * 100))
            : 0;
          const remaining = Math.max(0, proj.budget - proj.current_expense);
          const badge = getProjectStatusBadge(proj.status);

          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{proj.name}</h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {proj.description || 'প্রকল্পের বিবরণ নেই।'}
                </p>

                {/* Progress bar and percentages */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">কাজের অগ্রগতি</span>
                    <span className="font-bold font-mono text-emerald-900">
                      {toBengaliNumber(progress)}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div>
                      <div className="text-slate-500 text-[10px]">মোট বাজেট</div>
                      <div className="font-bold font-mono text-slate-900 mt-0.5">{formatTaka(proj.budget)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">এ যাবত ব্যয়</div>
                      <div className="font-bold font-mono text-rose-700 mt-0.5">{formatTaka(proj.current_expense)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">অবশিষ্ট বাজেট</div>
                      <div className="font-bold font-mono text-emerald-800 mt-0.5">{formatTaka(remaining)}</div>
                    </div>
                  </div>
                </div>

                {/* Meta details */}
                <div className="space-y-1.5 text-xs text-slate-600 mt-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>দায়িত্বপ্রাপ্ত: {proj.responsible_person || 'পরিচালনা কমিটি'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      শুরু: {formatBengaliDate(proj.start_date)}
                      {proj.expected_completion_date && ` · সমাপ্তির লক্ষ্য: ${formatBengaliDate(proj.expected_completion_date)}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit button */}
              {currentUser.role !== 'normal_user' && (
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>অগ্রগতি বা তথ্য আপডেট</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
              <h3 className="font-bold text-sm">
                {editingProject ? 'প্রকল্প তথ্য ও অগ্রগতি হালনাগাদ' : 'নতুন উন্নয়ন প্রকল্প শুরু করুন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  প্রকল্পের নাম <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মক্তব ভবন সংস্কার ও ছাদ ঢালাই"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  বিস্তারিত বিবরণ:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="কাজের বিস্তারিত বিবরণ ও প্রয়োজনীয়তা..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    মোট প্রাক্কলিত বাজেট (৳) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    এ পর্যন্ত মোট ব্যয় (৳):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentExpense}
                    onChange={(e) => setCurrentExpense(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    শুরুর তারিখ:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    সমাপ্তির সম্ভাব্য তারিখ:
                  </label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    প্রকল্পের অবস্থা:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
                  >
                    <option value="running">চলমান (Running)</option>
                    <option value="completed">সম্পন্ন (Completed)</option>
                    <option value="on_hold">স্থগিত (On Hold)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    দায়িত্বপ্রাপ্ত ব্যক্তি:
                  </label>
                  <input
                    type="text"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    placeholder="যেমন: মাওলানা আব্দুর রহমান"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  {editingProject ? 'হালনাগাদ করুন' : 'প্রকল্প যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
