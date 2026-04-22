import { Trophy, TrendingUp, Calendar, Zap, Star, Target, ArrowUpRight, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function PerformanceView() {
  const stats = [
    { label: 'Overall Mastery', value: '72%', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Quiz Success', value: '88%', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Study Streak', value: '5 Days', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Time Spent', value: '124h', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Performance Analytics</h1>
        <p className="text-slate-500 mt-2">Personalized insights for your competitive exam journey</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Syllabus Coverage
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target: JEE 2026</span>
          </div>
          <div className="space-y-6">
            {[
              { subject: 'Physics', current: 75, target: 100, color: 'bg-indigo-500' },
              { subject: 'Chemistry', current: 62, target: 100, color: 'bg-emerald-500' },
              { subject: 'Mathematics', current: 48, target: 100, color: 'bg-purple-500' },
              { subject: 'Mock Tests', current: 25, target: 100, color: 'bg-orange-500' },
            ].map(sub => (
              <div key={sub.subject} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold">{sub.subject}</span>
                  <span className="text-slate-500">{sub.current}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.current}%` }}
                    transition={{ duration: 1.5 }}
                    className={cn("h-full rounded-full flex items-center justify-end pr-2", sub.color)}
                  >
                    <div className="w-1 h-1 bg-white rounded-full opacity-50" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Study Load History
            </h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2 relative z-10">
            {[45, 60, 30, 85, 95, 40, 70].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className="w-full bg-indigo-600/30 rounded-t-lg relative group cursor-help"
              >
                <div className="absolute inset-0 bg-indigo-500 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.round(height/10)}h study
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 relative z-10">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 relative z-10">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                <Star className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Smart Recommendation</p>
                <p className="text-xs font-medium">Focus on Mathematics integration topics this weekend. Your mastery is below average there.</p>
             </div>
             <ArrowUpRight className="w-4 h-4 ml-auto text-slate-500 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
