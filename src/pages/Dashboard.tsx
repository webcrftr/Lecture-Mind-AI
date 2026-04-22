import { useEffect, useState } from 'react';
import ContentUpload from '../components/ContentUpload';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Book, Clock, Star, TrendingUp, CheckCircle2, Flame, Timer } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentMaterials, setRecentMaterials] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'studyMaterials'),
      where('userId', '==', user.uid),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentMaterials(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const stats = [
    { label: 'Syllabus Done', value: '64%', change: '+2.4% this week', color: 'text-green-500' },
    { label: 'Concept Mastery', value: 'A-', change: 'Top 10% percentile', color: 'text-indigo-500' },
    { label: 'Quizzes Taken', value: '142', change: 'Across 4 subjects', color: 'text-slate-400' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ContentUpload />
      </div>

      <div className="col-span-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                <span className={cn("text-[9px] font-bold mb-1", stat.color)}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800">Subject Performance</h2>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">JEE 2026 Target</span>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[
              { name: 'Physics', progress: 78, total: 100, color: 'bg-indigo-500', note: 'Strong: Mechanics • Weak: Waves' },
              { name: 'Chemistry', progress: 41, total: 110, color: 'bg-emerald-500', note: 'Strong: Organic • Weak: Thermo' },
              { name: 'Biology', progress: 95, total: 95, color: 'bg-pink-500', note: 'Fully Mastered • Revision Due' },
              { name: 'Maths', progress: 46, total: 120, color: 'bg-amber-500', note: 'Strong: Calculus • Weak: Prob' },
            ].map(sub => (
              <div key={sub.name} className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{sub.name}</span>
                  <span className="text-slate-500">{sub.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.progress}%` }}
                    className={cn("h-full rounded-full transition-all duration-1000", sub.color)}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{sub.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Materials</h3>
            <Link to="/subjects" className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">Library</Link>
          </div>
          <div className="space-y-3">
            {recentMaterials.length > 0 ? (
              recentMaterials.map((item) => (
                <Link
                  key={item.id}
                  to={`/material/${item.id}`}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors block group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-[9px] font-bold">AI</div>
                      <p className="text-xs font-semibold text-slate-700 truncate w-32">{item.topic}</p>
                    </div>
                    <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest">Ready</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 font-medium">{item.subject} • 2 hours ago</p>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <Book className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-[10px] text-slate-400">No materials yet</p>
              </div>
            )}
          </div>
          <Link to="/subjects" className="w-full mt-4 block text-center py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            View Full Library
          </Link>
        </div>

        <div className="bg-indigo-900 rounded-2xl p-5 text-white shadow-xl flex flex-col min-h-[220px] relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 mb-3 z-10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Focus Rec</p>
          </div>
          <h4 className="text-lg font-bold leading-tight mb-2 z-10">Calculus: Definite Integrals</h4>
          <p className="text-xs opacity-70 mb-4 z-10 leading-relaxed">You missed 4/5 questions on this topic in your last quiz. AI recommends a 20-min revision session.</p>
          <button className="mt-auto w-full py-2.5 bg-white text-indigo-900 rounded-lg text-xs font-black shadow-md hover:bg-indigo-50 transition-colors active:scale-95 z-10">
            Start Smart Revision
          </button>
        </div>
      </div>
    </div>
  );
}
