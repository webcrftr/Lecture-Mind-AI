import { Search, Bell, Chrome } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function TopNav() {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
        <h1 className="font-bold text-slate-900 tracking-tight">LectureMind AI</h1>
        <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">JEE/NEET Pro</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search your notes..." 
            className="w-64 pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-xs focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600 outline-none"
          />
        </div>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800">{user?.displayName}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">PCM • 12th Grade</p>
          </div>
          <div className="w-9 h-9 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
