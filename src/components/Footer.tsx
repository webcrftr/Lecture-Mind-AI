export default function Footer() {
  return (
    <footer className="h-8 bg-slate-800 flex items-center justify-between px-6 text-[10px] text-slate-400 shrink-0 z-30">
      <div className="flex gap-4">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
          Server Status: <span className="text-emerald-400 font-bold">Optimal</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
          Google Gemini API: <span className="text-emerald-400 font-bold">Connected</span>
        </span>
      </div>
      <div className="flex gap-4">
        <span>Exam Date: <span className="text-white">May 15, 2024</span> (62 Days Left)</span>
        <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">v1.2.4-stable</span>
      </div>
    </footer>
  );
}
