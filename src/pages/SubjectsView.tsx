import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { BookOpen, ChevronRight, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const SUBJECTS = [
  { name: 'Physics', color: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' },
  { name: 'Chemistry', color: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  { name: 'Biology', color: 'bg-pink-100 text-pink-700', border: 'border-pink-200' },
  { name: 'Maths', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
];

export default function SubjectsView() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'studyMaterials'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const filtered = materials.filter(m => 
    (activeSubject === 'All' || m.subject.toLowerCase() === activeSubject.toLowerCase()) &&
    (m.topic.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Subjects</h1>
          <p className="text-slate-500">Organized study material by category</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics..."
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-[11px] w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveSubject('All')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0",
            activeSubject === 'All' ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          All Subjects
        </button>
        {SUBJECTS.map(sub => (
          <button
            key={sub.name}
            onClick={() => setActiveSubject(sub.name)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0",
              activeSubject === sub.name ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const subData = SUBJECTS.find(s => s.name.toLowerCase() === item.subject.toLowerCase()) || SUBJECTS[0];
          return (
            <Link
              key={item.id}
              to={`/material/${item.id}`}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-widest", subData.color)}>
                  {item.subject}
                </div>
                <BookOpen className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h3 className="font-bold text-sm mb-3 line-clamp-1 text-slate-800">{item.topic}</h3>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <span>Notes Ready</span>
                <div className="flex items-center gap-1 text-indigo-600">
                  Open
                  <ChevronRight className="w-2.5 h-2.5" />
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white border border-slate-100 rounded-3xl">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No materials found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
