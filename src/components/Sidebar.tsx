import { LayoutDashboard, BookOpen, Brain, Timer, Trophy, Settings, Flame } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Course Library', path: '/subjects' },
    { icon: Brain, label: 'Flashcards', path: '/flashcards' },
    { icon: Timer, label: 'Quizzes', path: '/quizzes' },
    { icon: Trophy, label: 'Analytics', path: '/performance' },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200 p-4 flex flex-col gap-1 h-full">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.path
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mt-4 border-t border-slate-50 pt-4",
            location.pathname === '/settings'
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>

      <div className="mt-auto">
        <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Current Streak</p>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="w-5 h-5 fill-current text-white" />
            <p className="text-2xl font-bold">12 Days</p>
          </div>
          <div className="mt-3 h-1 bg-white/20 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-[10px] mt-2 opacity-90 font-medium">3 more days for Milestone!</p>
        </div>
      </div>
    </aside>
  );
}
