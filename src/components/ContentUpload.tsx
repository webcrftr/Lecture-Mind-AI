import { useState } from 'react';
import { Youtube, FileText, Type as TypeIcon, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { processContent } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';

type UploadType = 'youtube' | 'pdf' | 'text';

export default function ContentUpload() {
  const { user } = useAuth();
  const [activeType, setActiveType] = useState<UploadType>('youtube');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!value && activeType !== 'pdf') return;
    setLoading(true);
    setProgress(10);

    try {
      // 1. In a real app, we'd fetch transcription from YouTube or extract from PDF
      // For now, if it's text, we use it directly.
      // If it's a link, we'd need a more complex backend or tool.
      // We'll simulate fetching for now.
      
      let textToProcess = value;
      if (activeType === 'youtube') {
        setProgress(30);
        // Simulation: fetch transcript
        textToProcess = `Simulated transcript for ${value}. Educational content about Electron configuration in Chemistry...`;
      }

      setProgress(50);
      const aiData = await processContent(textToProcess, activeType);
      setProgress(85);

      // Save content and study materials
      const contentRef = await addDoc(collection(db, 'contents'), {
        userId: user!.uid,
        type: activeType,
        source: value,
        title: aiData.topic,
        transcript: textToProcess,
        createdAt: serverTimestamp(),
        status: 'completed'
      });

      await addDoc(collection(db, 'studyMaterials'), {
        contentId: contentRef.id,
        userId: user!.uid,
        summary: aiData.summary,
        concepts: aiData.concepts,
        formulas: aiData.formulas,
        subject: aiData.subject,
        topic: aiData.topic
      });

      // Add Flashcards
      for (const card of aiData.flashcards) {
        await addDoc(collection(db, 'flashcards'), {
          userId: user!.uid,
          contentId: contentRef.id,
          question: card.question,
          answer: card.answer,
          subject: aiData.subject,
          masteryLevel: 1,
          nextReview: new Date().toISOString()
        });
      }

      // Add Quiz
      await addDoc(collection(db, 'quizzes'), {
        contentId: contentRef.id,
        userId: user!.uid,
        questions: aiData.quizzes,
        topic: aiData.topic,
        subject: aiData.subject
      });

      setProgress(100);
      setValue('');
      alert('Content processed successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to process content');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">AI Content Processor</h2>
          <p className="text-xs text-slate-500">Upload YouTube links or PDFs to generate study materials instantly.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveType('pdf')}
             className={cn(
               "px-4 py-2 text-xs font-semibold rounded-lg transition-colors",
               activeType === 'pdf' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
             )}
           >
             Upload PDF
           </button>
           <button 
             onClick={() => setActiveType('youtube')}
             className={cn(
               "px-4 py-2 text-xs font-semibold rounded-lg transition-colors",
               activeType === 'youtube' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
             )}
           >
             Process Link
           </button>
           <button 
             onClick={() => setActiveType('text')}
             className={cn(
               "px-4 py-2 text-xs font-semibold rounded-lg transition-colors",
               activeType === 'text' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
             )}
           >
             Paste Text
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="space-y-4"
        >
          {activeType === 'youtube' && (
            <div className="flex gap-3">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <Youtube className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Paste YouTube URL here (e.g., Organic Chemistry Mechanism...)"
                  className="bg-transparent w-full text-xs text-slate-700 border-none focus:ring-0 outline-none"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={loading || !value}
                className="bg-indigo-600 text-white px-6 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:bg-slate-200 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Process"}
              </button>
            </div>
          )}

          {activeType === 'pdf' && (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 transition-colors hover:bg-slate-100 cursor-pointer">
              <Upload className="w-6 h-6 text-indigo-600 mb-2" />
              <p className="text-xs font-bold text-slate-700">Click or drag PDF to upload</p>
              <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">Max 10MB</p>
            </div>
          )}

          {activeType === 'text' && (
            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Paste your lecture notes..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-xs leading-relaxed"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button
                onClick={handleUpload}
                disabled={loading || !value}
                className="w-full bg-indigo-600 text-white h-10 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-3 h-3 fill-current" /> Generate Study Material</>}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
