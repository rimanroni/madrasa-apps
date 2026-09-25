import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Apple, 
  CheckCircle2, 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { useMaktab } from '../context/MaktabContext';
import { getThemeClasses } from '../types/theme';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const { themeConfig, maktabSettings } = useMaktab();
  const themeClasses = getThemeClasses(themeConfig?.color);

  const [activeTab, setActiveTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-linear-to-r from-emerald-800 to-teal-900 text-white shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center">
              <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  মোবাইল অ্যাপ
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-200 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-300" /> প্লে-স্টোর ছাড়াই ইনস্টল
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mt-0.5">
                {maktabSettings.maktab_name || 'নূরানী মক্তব'}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            কোনো অ্যাপ স্টোরে খোঁজাখুঁজি ছাড়াই সরাসরি আপনার ফোনে আসল অ্যাপ হিসেবে নামিয়ে নিন।
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Quick Direct Install Button if supported by browser */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-center sm:justify-start gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                  ১-ক্লিকে ইনস্টল উপলব্ধ!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  আপনার ব্রাউজার সরাসরি ইনস্টল সাপোর্ট করছে।
                </p>
              </div>
              <button
                onClick={handleInstallClick}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl ${themeClasses.primaryBtn} text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer`}
              >
                <Download className="w-4 h-4" />
                <span>ফোনে ইনস্টল করুন</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  অ্যাপটি ইতিমধ্যেই সফলভাবে ইনস্টল করা আছে!
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  আপনার ফোনের হোম স্ক্রিন থেকে আইকনটিতে ক্লিক করলেই সরাসরি ওপেন হবে।
                </p>
              </div>
            </div>
          )}

          {/* OS Switcher Tabs */}
          <div>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-4">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>অ্যান্ড্রয়েড ফোন (Android)</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Apple className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>আইফোন (iPhone / iPad)</span>
              </button>
            </div>

            {/* Android Instructions */}
            {activeTab === 'android' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">ফোনের Chrome ব্রাউজারে লিংকটি খুলুন:</strong>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      নিচের "লিংক কপি করুন" বাটনে ক্লিক করে ফোনের Google Chrome ব্রাউজারে পেস্ট করুন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">উপরে ডানপাশের ৩-ডট মেনু (⋮) চাপুন:</strong>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Chrome ব্রাউজারের একদম উপরে ডান কোণায় ৩টি ফোঁটা (⋮) মেনু দেখতে পাবেন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">"Install app" বা "Add to Home screen" চাপুন:</strong>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      মেনু থেকে <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন)-এ ট্যাপ করে <strong>"Install"</strong> নিশ্চিত করুন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                    ব্যাস! আপনার ফোনের হোম স্ক্রিনে ফেসবুক বা হোয়াটসঅ্যাপের মতোই একটি অ্যাপ তৈরি হয়ে যাবে।
                  </p>
                </div>
              </div>
            )}

            {/* iOS Instructions */}
            {activeTab === 'ios' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">আইফোনের Safari ব্রাউজারে খুলুন:</strong>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      লিংকটি Safari ব্রাউজারে ওপেন করুন (Chrome এ আইফোনে ইন্সটল অপশন আসে না)।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">নিচে Share আইকন চাপুন:</strong>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      সাফারি ব্রাউজারের নিচে মাঝে থাকা তীর চিহ্নের <strong>Share</strong> (বক্সের উপর তীর) আইকনে চাপুন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </span>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">"Add to Home Screen" (+) এ ট্যাপ করুন:</strong>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      একটু নিচে স্ক্রল করে প্লাস চিহ্নযুক্ত <strong>"Add to Home Screen"</strong> চাপুন এবং উপরে ডানপাশে <strong>"Add"</strong> চাপুন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    আপনার আইফোনের অ্যাপ পেজে অ্যাপের সুন্দর আইকন যুক্ত হয়ে যাবে।
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Copy Link Box */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ফোনে পাঠানোর জন্য অ্যাপ লিংক:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 select-all outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে!' : 'কপি লিংক'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              💡 এই লিংকটি আপনার নিজের WhatsApp এ পাঠিয়ে ফোনে একবার ক্লিক করলেই সহজে ইনস্টল করতে পারবেন।
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
