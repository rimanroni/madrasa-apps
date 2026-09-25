import React, { useState } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { 
  Plus, 
  X, 
  HandCoins, 
  TrendingUp, 
  TrendingDown, 
  UserPlus 
} from 'lucide-react';

interface FloatingActionButtonProps {
  onOpenContributionModal: () => void;
  onOpenIncomeModal: () => void;
  onOpenExpenseModal: () => void;
  onOpenMemberModal: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onOpenContributionModal,
  onOpenIncomeModal,
  onOpenExpenseModal,
  onOpenMemberModal
}) => {
  const { currentUser, isPublicView, isAdminLoggedIn } = useMaktab();
  const [isOpen, setIsOpen] = useState(false);

  // Normal users & unauthenticated users cannot add data
  if (isPublicView || !isAdminLoggedIn || currentUser.role === 'normal_user') {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden no-print">
      
      {/* Expanded Quick Action Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 mb-3 transition-all duration-200">
          
          {/* Action 1: অবদান যোগ */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenContributionModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 text-white rounded-full shadow-lg text-xs font-semibold cursor-pointer active:scale-95 transition"
          >
            <span>অবদান যোগ করুন</span>
            <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center">
              <HandCoins className="w-4 h-4 text-emerald-200" />
            </div>
          </button>

          {/* Action 2: আয় যোগ */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenIncomeModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-sky-800 text-white rounded-full shadow-lg text-xs font-semibold cursor-pointer active:scale-95 transition"
          >
            <span>আয় যোগ করুন</span>
            <div className="w-7 h-7 rounded-full bg-sky-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-sky-200" />
            </div>
          </button>

          {/* Action 3: ব্যয় যোগ */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenExpenseModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-800 text-white rounded-full shadow-lg text-xs font-semibold cursor-pointer active:scale-95 transition"
          >
            <span>ব্যয় যোগ করুন</span>
            <div className="w-7 h-7 rounded-full bg-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-200" />
            </div>
          </button>

          {/* Action 4: সদস্য যোগ */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenMemberModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-800 text-white rounded-full shadow-lg text-xs font-semibold cursor-pointer active:scale-95 transition"
          >
            <span>সদস্য যোগ করুন</span>
            <div className="w-7 h-7 rounded-full bg-amber-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-amber-200" />
            </div>
          </button>

        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-950/20 cursor-pointer transition-transform"
        aria-label="দ্রুত এন্ট্রি মেনু"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

    </div>
  );
};
