import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Timer, CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSearchParams, Link } from 'react-router-dom';

export default function QuizView() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const quizIdParam = searchParams.get('quiz');
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'quizzes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(data);
      if (quizIdParam) {
        const found = data.find(q => q.id === quizIdParam);
        if (found) setActiveQuiz(found);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, quizIdParam]);

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === activeQuiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (loading) return <div className="p-20 text-center">Loading Quizzes...</div>;

  if (!activeQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Available Quizzes</h1>
          <p className="text-slate-500">Test your knowledge on generated materials</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuiz(q)}
                    className="p-5 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black rounded uppercase tracking-widest">{q.subject}</span>
                      <Timer className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500" />
                    </div>
                    <h3 className="font-bold text-sm mb-1 text-slate-800 line-clamp-1">{q.topic}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{q.questions.length} Qs • 10 Mins</p>
                  </button>
          ))}
          {quizzes.length === 0 && (
            <div className="col-span-full p-20 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500">No quizzes available yet. Upload content to generate them!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xl p-12"
      >
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 mb-8">Great effort on {activeQuiz.topic}</p>
        
        <div className="space-y-4 mb-8">
          <div className="bg-slate-50 p-6 rounded-2xl">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Your Score</p>
            <p className="text-5xl font-black text-slate-900">{percentage}%</p>
            <p className="text-sm text-slate-500 mt-2">{score} correct out of {activeQuiz.questions.length}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={restartQuiz}
            className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => setActiveQuiz(null)}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Finish
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = activeQuiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveQuiz(null)}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Quit Quiz
        </button>
        <div className="flex items-center gap-4">
          <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
          <span className="text-xs font-bold text-slate-400">
            {currentQuestionIndex + 1} / {activeQuiz.questions.length}
          </span>
        </div>
      </div>

      <div className="space-y-8">
         <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 block">Question {currentQuestionIndex + 1}</span>
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">
              {currentQuestion.question}
            </h2>
         </div>

         <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option: string) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = selectedAnswer === option;
              
              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={cn(
                    "p-5 rounded-2xl border-2 text-left transition-all relative flex items-center justify-between",
                    !isAnswered && "border-slate-100 hover:border-blue-500 hover:bg-blue-50 bg-white",
                    isAnswered && isCorrect && "border-green-500 bg-green-50 text-green-700",
                    isAnswered && isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-700",
                    isAnswered && !isSelected && !isCorrect && "border-slate-100 opacity-50 bg-white"
                  )}
                >
                  <span className="font-semibold">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
         </div>

         <AnimatePresence>
           {isAnswered && (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-blue-50 border border-blue-100 p-6 rounded-2xl"
             >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm mb-1">Explanation</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full mt-6 bg-slate-900 text-white rounded-xl h-12 font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  {currentQuestionIndex + 1 === activeQuiz.questions.length ? 'Finish Quiz' : 'Next Question'}
                  <ChevronRight className="w-4 h-4" />
                </button>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
