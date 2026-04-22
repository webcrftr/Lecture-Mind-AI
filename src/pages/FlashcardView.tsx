import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Brain, ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSearchParams } from 'react-router-dom';

export default function FlashcardView() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topic');
  
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let q = query(
      collection(db, 'flashcards'),
      where('userId', '==', user.uid)
    );

    if (topicId) {
      q = query(q, where('contentId', '==', topicId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, topicId]);

  const handleMastery = async (level: number) => {
    const card = cards[currentIndex];
    const cardRef = doc(db, 'flashcards', card.id);
    await updateDoc(cardRef, {
      masteryLevel: level,
      lastReviewed: new Date().toISOString()
    });
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  if (loading) return <div className="p-20 text-center">Loading Cards...</div>;
  if (cards.length === 0) return <div className="p-20 text-center">No flashcards found. Create some by uploading content!</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-10">
      <header className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
          <Brain className="w-3 h-3" />
          Active Recall Session
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Concept Flashcards</h1>
        <p className="text-[11px] text-slate-500 font-medium">Card {currentIndex + 1} of {cards.length}</p>
      </header>

      <div className="relative h-96 perspective-1000 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, rotateY: -20, x: 20 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, rotateY: 20, x: -20 }}
            className={cn(
              "w-full h-full cursor-pointer flashcard-inner relative",
              isFlipped && "flashcard-flipped"
            )}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 bg-white rounded-3xl border border-slate-100 shadow-xl p-10 flex flex-col items-center justify-center text-center flashcard-front">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Question</span>
              <p className="text-xl font-bold text-slate-800 leading-snug">
                {currentCard.question}
              </p>
              <div className="mt-auto flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-wider">
                <RotateCw className="w-3 h-3" />
                Click to flip
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 bg-white rounded-3xl border-2 border-indigo-500 shadow-xl p-10 flex flex-col items-center justify-center text-center flashcard-back">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Answer</span>
              <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
                {currentCard.answer}
              </p>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleMastery(0); }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors font-black text-[9px] uppercase tracking-widest shadow-sm"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Still Hard
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleMastery(2); }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-200"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mastered
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-8 items-center pt-8">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)}
          className="p-4 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Flip Card
        </button>
        <button
          onClick={nextCard}
          className="p-4 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-10 border-t border-slate-100">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-[10px] uppercase font-black text-amber-600 tracking-widest mb-1">Subject</p>
          <p className="font-bold text-slate-800">{currentCard.subject}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <p className="text-[10px] uppercase font-black text-indigo-600 tracking-widest mb-1">Current Mastery</p>
          <p className="font-bold text-slate-800">{currentCard.masteryLevel > 1 ? 'High Proficiency' : 'Training'}</p>
        </div>
      </div>
    </div>
  );
}
