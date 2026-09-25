import React, { useState, useMemo } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { Member } from '../types/database';
import { formatTaka, formatBengaliDate, toBengaliNumber } from '../utils/bengali';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  HandCoins, 
  Edit2, 
  Trash2, 
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface MembersViewProps {
  onOpenMemberModal: (member?: Member) => void;
  onOpenContributionModalWithMember: (member: Member) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  onOpenMemberModal,
  onOpenContributionModalWithMember
}) => {
  const { 
    members, 
    contributions, 
    deleteMember, 
    setActiveMemberDetail, 
    currentUser 
  } = useMaktab();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(query);
        const matchesId = m.member_id?.toLowerCase().includes(query);
        const matchesPhone = m.mobile?.toLowerCase().includes(query);
        const matchesAddress = m.address?.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesPhone && !matchesAddress) return false;
      }
      return true;
    });
  }, [members, selectedStatus, searchQuery]);

  // Calculate member total contributed
  const getMemberTotal = (memberId: string, memberName: string) => {
    return contributions
      .filter((c) => c.member_id === memberId || c.donor_name === memberName)
      .reduce((sum, c) => sum + (c.amount || 0), 0);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}" সদস্যকে তালিকা থেকে মুছে ফেলতে চান?`)) {
      deleteMember(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-1">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>মক্তবের নিবন্ধিত সদস্য রেজিস্টার</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            সম্মানিত সদস্যবৃন্দ ও মাসিক অবদানের হিসাব
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            গ্রামের নিয়মিত দ্বীনি সহযোগী সদস্যগণের তথ্য ও মাসিক অবদানের পরিসংখ্যান
          </p>
        </div>

        {currentUser.role !== 'normal_user' && (
          <button
            onClick={() => onOpenMemberModal()}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন সদস্য নিবন্ধন</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, সদস্য আইডি বা মোবাইল দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              সকল ({toBengaliNumber(members.length)})
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                selectedStatus === 'active' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              সক্রিয় ({toBengaliNumber(members.filter(m => m.status === 'active').length)})
            </button>
            <button
              onClick={() => setSelectedStatus('inactive')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                selectedStatus === 'inactive' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              নিষ্ক্রিয়
            </button>
          </div>
        </div>

      </div>

      {/* Members Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-xs">
            কোনো সদস্যের রেকর্ড পাওয়া যায়নি।
          </div>
        ) : (
          filteredMembers.map((member) => {
            const totalContributed = getMemberTotal(member.id, member.name);

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar of card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                        {member.name.charAt(0) || 'স'}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 hover:text-emerald-800 cursor-pointer" onClick={() => setActiveMemberDetail(member)}>
                          {member.name}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5">
                          {member.member_id}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        member.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>

                  {/* Contact & Address */}
                  <div className="space-y-1.5 text-xs text-slate-600 my-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{member.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.address || 'গ্রাম উল্লেখ নেই'}</span>
                    </div>
                  </div>

                  {/* Contributions Stat pill */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl my-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">মাসিক হার</div>
                      <div className="font-bold font-mono text-slate-800 mt-0.5">
                        {formatTaka(member.monthly_contribution_amount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-800 font-medium">মোট জমা</div>
                      <div className="font-bold font-mono text-emerald-950 mt-0.5">
                        {formatTaka(totalContributed)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setActiveMemberDetail(member)}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>প্রোফাইল</span>
                  </button>

                  {currentUser.role !== 'normal_user' && (
                    <>
                      <button
                        onClick={() => onOpenContributionModalWithMember(member)}
                        className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="অবদান জমা করুন"
                      >
                        <HandCoins className="w-3.5 h-3.5" />
                        <span>জমা</span>
                      </button>

                      <button
                        onClick={() => onOpenMemberModal(member)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
