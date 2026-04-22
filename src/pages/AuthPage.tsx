import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Mail, Lock, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20"
          >
            <Zap className="text-white w-10 h-10 fill-current" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">LectureMind <span className="text-indigo-600">AI</span></h1>
          <p className="text-slate-500 mt-2">The ultimate study companion for JEE/NEET</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-14 bg-white border-2 border-slate-100 hover:border-slate-200 rounded-2xl flex items-center justify-center gap-3 font-semibold text-slate-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              ) : (
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              )}
              Continue with Google
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium tracking-widest">or login with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
              <button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]">
                Login to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs px-8">
          By continuing, you agree to LectureMind AI's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
