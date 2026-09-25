import React, { useState } from 'react';
import { Smartphone, Download, Check } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'mobile' | 'floating';
  themeClass?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'header', 
  themeClass = 'bg-emerald-600 hover:bg-emerald-700 text-white' 
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already installed and running inside the standalone app, do not show button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    // If browser prompt is ready, trigger it directly or show modal
    if (isInstallable) {
      const res = await install();
      if (!res) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-2xs hover:scale-105 active:scale-95 ${themeClass}`}
        title="ফোনে অ্যাপ ইনস্টল করুন"
        aria-label="ফোনে অ্যাপ ইনস্টল করুন"
      >
        <Smartphone className="w-3.5 h-3.5 animate-pulse" />
        <span className="hidden sm:inline">অ্যাপ ইনস্টল</span>
        <span className="sm:hidden">ইনস্টল</span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
