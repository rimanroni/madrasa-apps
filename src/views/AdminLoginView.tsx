import React, { useState } from 'react';
import { useMaktab } from '../context/MaktabContext';
import { CREATOR_BRANDING } from '../constants/branding';
import { getThemeClasses } from '../types/theme';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Phone
} from 'lucide-react';

interface AdminLoginViewProps {
  onBackToPublic?: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ 
  onBackToPublic,
  onLoginSuccess 
}) => {
  const { maktabSettings, loginAdmin, showToast, themeConfig } = useMaktab();
  const themeClasses = getThemeClasses(themeConfig?.color);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        loginAdmin(data.token, data.role);
        showToast(data.message || 'সফলভাবে অ্যাডমিন ড্যাশবোর্ডে লগইন হয়েছে।', 'success');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setErrorMessage(data.message || 'ভুল পাসওয়ার্ড! অ্যাডমিন ড্যাশবোর্ডে প্রবেশের অনুমতি নেই।');
      }
    } catch (err) {
      console.error('Login request error:', err);
      // Fallback verification if server endpoint is unavailable
      const res = await fetch('/api/admin/verify', { method: 'POST' }).catch(() => null);
      setErrorMessage('লগইন সার্ভারের সাথে সংযোগে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Top Header / Back Button */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pt-2">
        <button
          onClick={onBackToPublic}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-2 rounded-xl backdrop-blur-md transition-all cursor-pointer border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পাবলিক সাইট দেখুন</span>
        </button>

        <span className="text-[11px] font-bold tracking-widest text-emerald-400/80 uppercase">
          সিকিউর অ্যাডমিন পোর্টাল
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle decorative glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Maktab Logo & Title */}
          <div className="text-center mb-8 relative">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/40 border border-white/20">
              {maktabSettings.logo_url ? (
                <img 
                  src={maktabSettings.logo_url} 
                  alt={maktabSettings.maktab_name} 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              ) : (
                <ShieldCheck className="w-9 h-9" />
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {maktabSettings.maktab_name}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-emerald-200/90 mt-1">
              হিসাব ও কেন্দ্রীয় ব্যবস্থাপনা অ্যাডমিন লগইন
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>অ্যাডমিন পাসওয়ার্ড</span>
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="অ্যাডমিনিস্ট্রেটর পাসওয়ার্ড দিন"
                  autoComplete="current-password"
                  required
                  className="w-full bg-slate-900/80 border border-white/20 rounded-2xl px-4 py-3.5 pl-11 pr-12 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
                />
                
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 ${themeClasses.primaryBtn} font-bold text-sm sm:text-base rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
                </>
              )}
            </button>
          </form>

          {/* Secure System Notice */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] font-medium text-slate-300 leading-relaxed">
              শুধুমাত্র অনুমোদিত সভাপতি, হিসাবরক্ষক বা কেন্দ্রীয় অ্যাডমিন পাসওয়ার্ড দিয়ে সম্পূর্ণ কার্যপ্রণালী নিয়ন্ত্রণ করতে পারবেন।
            </p>
          </div>

        </div>
      </div>

      {/* Permanent Creator Branding Footer */}
      <footer className="max-w-md mx-auto w-full text-center py-4 border-t border-white/10">
        <div className="text-xs font-medium text-slate-400">
          {CREATOR_BRANDING.banglaNotice}
        </div>
        <div className="text-sm font-bold text-emerald-300 mt-0.5 tracking-wide">
          {CREATOR_BRANDING.name}
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 mt-1 font-mono">
          <Phone className="w-3 h-3 text-emerald-400" />
          <span>{CREATOR_BRANDING.phone}</span>
        </div>
      </footer>

    </div>
  );
};
