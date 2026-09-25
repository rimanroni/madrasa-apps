import React, { useState } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { Notice, Meeting } from '../types/database';
import { formatBengaliDate, getPriorityBadge } from '../utils/bengali';
import { 
  Bell, 
  Calendar, 
  Plus, 
  X, 
  MapPin, 
  Clock, 
  UserCheck, 
  Trash2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const NoticesMeetingsView: React.FC = () => {
  const { 
    notices, 
    meetings, 
    addNotice, 
    deleteNotice, 
    addMeeting, 
    currentUser, 
    showToast 
  } = useMaktab();

  const [activeSubTab, setActiveSubTab] = useState<'notices' | 'meetings'>('notices');

  // Notice Modal State
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticePriority, setNoticePriority] = useState<'urgent' | 'high' | 'normal'>('normal');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');

  // Meeting Modal State
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('বাদ আছর (বিকাল ৫:০০)');
  const [location, setLocation] = useState('মক্তব মিলনায়তন কক্ষ');
  const [agenda, setAgenda] = useState('');
  const [decisions, setDecisions] = useState('');
  const [attendeesText, setAttendeesText] = useState('');

  // Handle Notice Submit
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) {
      showToast('নোটিশের শিরোনাম দিন', 'error');
      return;
    }
    const success = await addNotice({
      title: noticeTitle.trim(),
      description: noticeDesc.trim(),
      priority: noticePriority,
      publish_date: publishDate,
      expiry_date: expiryDate || undefined,
      is_published: true,
      created_by: currentUser.full_name
    });
    if (success) {
      setNoticeTitle('');
      setNoticeDesc('');
      setIsNoticeModalOpen(false);
    }
  };

  // Handle Meeting Submit
  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      showToast('সভার শিরোনাম আবশ্যক', 'error');
      return;
    }
    const attendeesList = attendeesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const success = await addMeeting({
      title: meetingTitle.trim(),
      date: meetingDate,
      time: meetingTime.trim(),
      location: location.trim(),
      agenda: agenda.trim(),
      decisions: decisions.trim(),
      attendees: attendeesList,
      created_by: currentUser.full_name
    });

    if (success) {
      setMeetingTitle('');
      setAgenda('');
      setDecisions('');
      setAttendeesText('');
      setIsMeetingModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>যোগাযোগ ও কার্যবিবরণী বোর্ড</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            নোটিশ, ঘোষণা ও সাধারণ সভা
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            গ্রামবাসীর জ্ঞাতার্থে জারি করা সকল নোটিশ এবং কমিটির সিদ্ধান্তের রেকর্ড
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('notices')}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
              activeSubTab === 'notices'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            নোটিশ বোর্ড ({notices.length})
          </button>
          <button
            onClick={() => setActiveSubTab('meetings')}
            className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
              activeSubTab === 'meetings'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            কমিটি সভা ও সিদ্ধান্ত ({meetings.length})
          </button>
        </div>
      </div>

      {/* NOTICES TAB */}
      {activeSubTab === 'notices' && (
        <div className="space-y-4">
          {currentUser.role !== 'normal_user' && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsNoticeModalOpen(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন নোটিশ জারি করুন</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((n) => {
              const badge = getPriorityBadge(n.priority);
              return (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        প্রকাশ: {formatBengaliDate(n.publish_date)}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mt-2 leading-snug">
                      {n.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                      {n.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>জারি করেছেন: {n.created_by || 'মক্তব কর্তৃপক্ষ'}</span>
                    {currentUser.role !== 'normal_user' && (
                      <button
                        onClick={() => deleteNotice(n.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MEETINGS TAB */}
      {activeSubTab === 'meetings' && (
        <div className="space-y-4">
          {currentUser.role !== 'normal_user' && (
            <div className="flex justify-end">
              <button
                onClick={() => setIsMeetingModalOpen(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন সভা আহ্বান করুন</span>
              </button>
            </div>
          )}

          <div className="space-y-4">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{m.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{formatBengaliDate(m.date)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agenda & Decisions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-1">সভার এজেন্ডা / আলোচ্যসূচি:</h4>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{m.agenda}</p>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/60">
                    <h4 className="font-bold text-emerald-950 mb-1">গৃহীত সিদ্ধান্তসমূহ:</h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {m.decisions || 'এখনও সিদ্ধান্ত লিপিবদ্ধ করা হয়নি।'}
                    </p>
                  </div>
                </div>

                {/* Attendees */}
                {m.attendees && m.attendees.length > 0 && (
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 pt-2">
                    <span className="font-semibold text-slate-700">উপস্থিত সদস্যবৃন্দ:</span>
                    {m.attendees.map((att, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[11px]">
                        {att}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
              <h3 className="font-bold text-sm">নতুন নোটিশ জারি করুন</h3>
              <button onClick={() => setIsNoticeModalOpen(false)} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNoticeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  নোটিশের শিরোনাম <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="যেমন: পবিত্র রমজানের ক্লাস সময়সূচি পরিবর্তন"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  বিস্তারিত বিবরণ / বক্তব্য:
                </label>
                <textarea
                  rows={4}
                  required
                  value={noticeDesc}
                  onChange={(e) => setNoticeDesc(e.target.value)}
                  placeholder="নোটিশের সম্পূর্ণ বিবরণ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    অগ্রাধিকার স্তর:
                  </label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
                  >
                    <option value="normal">সাধারণ নোটিশ</option>
                    <option value="high">গুরুত্বপূর্ণ</option>
                    <option value="urgent">জরুরি নোটিশ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    প্রকাশের তারিখ:
                  </label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  নোটিশ প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
              <h3 className="font-bold text-sm">নতুন সাধারণ সভা আহ্বান ও রেকর্ড</h3>
              <button onClick={() => setIsMeetingModalOpen(false)} className="p-1 text-slate-300 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMeetingSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  সভার বিষয় / শিরোনাম <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="যেমন: ত্রৈমাসিক আয়-ব্যয় পর্যালোচনা সভা"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    তারিখ:
                  </label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    সময়:
                  </label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="বাদ মাগরিব"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  স্থান:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  আলোচ্যসূচি / এজেন্ডা:
                </label>
                <textarea
                  rows={2}
                  required
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="১. ভবন সংস্কার কাজের হিসাব অনুমোদন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  উপস্থিত সদস্যবৃন্দ (কমা দিয়ে লিখুন):
                </label>
                <input
                  type="text"
                  value={attendeesText}
                  onChange={(e) => setAttendeesText(e.target.value)}
                  placeholder="হাজী মোঃ নুরুল ইসলাম, মাওলানা আব্দুর রহমান, মোঃ হাফিজুল হক"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMeetingModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  সভা সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
