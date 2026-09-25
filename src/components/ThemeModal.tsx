import React from 'react';
import { useMaktab } from '../context/MaktabContext';
import { THEME_PRESETS, ThemeColor, ThemeMode, ThemeRadius, getThemeClasses } from '../types/theme';
import { 
  X, 
  Palette, 
  Sun, 
  Moon, 
  Check, 
  Sparkles,
  LayoutTemplate,
  SlidersHorizontal,
  Wallet,
  HandCoins
} from 'lucide-react';
import { formatTaka } from '../utils/bengali';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { themeConfig, updateThemeConfig, showToast } = useMaktab();

  if (!isOpen) return null;

  const currentThemeClasses = getThemeClasses(themeConfig.color);

  const handleColorChange = (color: ThemeColor) => {
    updateThemeConfig({ color });
    showToast(`থিম রঙ পরিবর্তন করা হয়েছে!`, 'info');
  };

  const handleModeChange = (mode: ThemeMode) => {
    updateThemeConfig({ mode });
    showToast(mode === 'dark' ? 'ডার্ক মোড সক্রিয় করা হয়েছে' : 'লাইট মোড সক্রিয় করা হয়েছে', 'info');
  };

  const handleRadiusChange = (radius: ThemeRadius) => {
    updateThemeConfig({ radius });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                থিম ও রঙ কাস্টমাইজেশন
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার পছন্দমতো ড্যাশবোর্ডের রঙ ও ভিজ্যুয়াল স্টাইল নির্বাচন করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* 1. Theme Color Palettes */}
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>প্রধান রঙের প্যালেট (Theme Palette)</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                বর্তমানে সক্রিয়: {THEME_PRESETS.find(p => p.id === themeConfig.color)?.name}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isSelected = themeConfig.color === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleColorChange(preset.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-4 h-4 rounded-full shadow-xs inline-block"
                          style={{ backgroundColor: preset.primaryHex }}
                        />
                        <span 
                          className="w-3 h-3 rounded-full opacity-80 inline-block"
                          style={{ backgroundColor: preset.accentHex }}
                        />
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {preset.name.split(' (')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Light / Dark Display Mode */}
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-3">
              ডিসপ্লে মোড (Light & Dark Mode)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleModeChange('light')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                  themeConfig.mode === 'light'
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/40 text-emerald-950 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div>লাইট মোড (স্বাভাবিক)</div>
                    <div className="text-[10px] text-slate-500 font-normal">উজ্জ্বল ও স্পষ্ট ইন্টারফেস</div>
                  </div>
                </div>
                {themeConfig.mode === 'light' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => handleModeChange('dark')}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                  themeConfig.mode === 'dark'
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-950/40 text-white font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-900/60 text-indigo-300 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div>ডার্ক মোড (রাত্রিকালীন)</div>
                    <div className="text-[10px] text-slate-500 font-normal">চোখের আরামদায়ক অন্ধকারাচ্ছন্ন রূপ</div>
                  </div>
                </div>
                {themeConfig.mode === 'dark' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* 3. Corner Radius / Modern Geometry */}
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-2">
              কার্ড ও বাটনের কোণা (Border Radius)
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'rounded', label: 'সফট রাউন্ডেড', sub: 'গোলাকার কোণা' },
                { id: 'modern', label: 'আধুনিক স্ট্যান্ডার্ড', sub: 'ভারসাম্যপূর্ণ' },
                { id: 'sharp', label: 'ক্লাসিক শার্প', sub: 'সুনির্দিষ্ট রেখা' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRadiusChange(r.id as ThemeRadius)}
                  className={`p-3 border rounded-xl text-center cursor-pointer transition ${
                    themeConfig.radius === r.id
                      ? 'border-emerald-600 dark:border-emerald-400 font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-medium text-xs">{r.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{r.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Live Visual Preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              লাইভ প্রিভিউ (Visual Preview)
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${currentThemeClasses.primaryBtn} flex items-center justify-center font-bold text-xs`}>
                  ৳
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">বর্তমান স্থিতি তহবিল</div>
                  <div className="text-[10px] text-slate-400">সর্বশেষ সমন্বয়কৃত ক্যাশ ও ব্যাংক ব্যালেন্স</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold font-mono text-sm ${currentThemeClasses.primaryText}`}>
                  {formatTaka(125400)}
                </div>
                <div className={`text-[10px] font-semibold ${currentThemeClasses.primaryText}`}>+১২.৫% প্রবৃদ্ধি</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 flex justify-end">
          <button
            onClick={() => {
              onClose();
              showToast('থিম সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', 'success');
            }}
            className={`px-6 py-2.5 ${currentThemeClasses.primaryBtn} font-bold rounded-xl text-xs shadow-xs cursor-pointer transition active:scale-98`}
          >
            সম্পন্ন করুন
          </button>
        </div>

      </div>
    </div>
  );
};
