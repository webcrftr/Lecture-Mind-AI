import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Book, FileText, List, Zap, Download, ChevronLeft, Layout, Columns } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';

export default function StudyMaterialView() {
  const { materialId } = useParams();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summaryMode, setSummaryMode] = useState<'short' | 'medium' | 'detailed'>('medium');

  useEffect(() => {
    async function fetchMaterial() {
      if (!materialId) return;
      const docRef = doc(db, 'studyMaterials', materialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setMaterial({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    }
    fetchMaterial();
  }, [materialId]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(material.topic, 20, 20);
    doc.setFontSize(12);
    doc.text(`Subject: ${material.subject}`, 20, 30);
    doc.text('Summary:', 20, 40);
    const splitText = doc.splitTextToSize(material.summary[summaryMode], 170);
    doc.text(splitText, 20, 50);
    doc.save(`${material.topic}-notes.pdf`);
  };

  if (loading) return <div className="flex items-center justify-center p-20">Loading Material...</div>;
  if (!material) return <div className="p-20 text-center">Material not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <header className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-widest">{material.subject}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{material.topic}</h1>
        </div>
        <button
           onClick={exportPDF}
           className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-200"
        >
          <Download className="w-3 h-3" />
          Export Material
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                Notes Summary
              </div>
              <div className="flex bg-slate-200/50 p-0.5 rounded-lg">
                {(['short', 'medium', 'detailed'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSummaryMode(mode)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[9px] uppercase font-black tracking-widest transition-all",
                      summaryMode === mode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="markdown-body">
                <ReactMarkdown>{material.summary[summaryMode]}</ReactMarkdown>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-6">
              <List className="w-3.5 h-3.5 text-emerald-600" />
              Core Concepts
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {material.concepts.map((concept: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <div className="w-5 h-5 bg-white border border-slate-200 rounded-md flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 group-hover:text-indigo-600 transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">{concept}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Formula List
            </div>
            <div className="space-y-2">
              {material.formulas.map((formula: string, i: number) => (
                <div key={i} className="p-2.5 bg-white/5 border border-white/10 rounded-lg font-mono text-[10px] leading-relaxed text-slate-300">
                  {formula}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-indigo-600 rounded-2xl p-5 text-white text-center shadow-lg shadow-indigo-200">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-90">Master this topic</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link to={`/quizzes?topic=${material.id}`} className="bg-white text-indigo-700 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-colors">
                <Layout className="w-3.5 h-3.5" />
                Practice Quiz
              </Link>
              <Link to={`/flashcards?topic=${material.id}`} className="bg-white/10 hover:bg-white/20 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-colors">
                <Columns className="w-3.5 h-3.5" />
                Flashcards
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
