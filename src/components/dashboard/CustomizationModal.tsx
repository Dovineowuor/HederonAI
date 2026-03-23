import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Sparkles, ArrowRight, Loader2, CheckCircle2,
  Target, Users, Zap, Briefcase, Globe, Rocket
} from "lucide-react";
import { STRATEGIC_QUESTIONS, type Question } from "@/lib/questionnaire";
import { useSession } from "next-auth/react";

interface CustomizationModalProps {
  onComplete: (context: Record<string, string>) => void;
  onClose: () => void;
  goal?: string;
  challenge?: string;
}

export default function CustomizationModal({ 
  onComplete, 
  onClose,
  goal,
  challenge
}: CustomizationModalProps) {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const currentQ = questions[step];

  // Fetch dynamic questions based on goal/challenge
  useEffect(() => {
    setLoading(true);
    fetch("/api/questionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, challenge }),
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch questionnaire", err);
        setLoading(false);
      });
  }, [goal, challenge]);

  // Load guest answers from localStorage if any
  useEffect(() => {
    if (!session) {
      const saved = localStorage.getItem("guest_user_context");
      if (saved) {
        try {
          setAnswers(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse guest context", e);
        }
      }
    }
  }, [session]);

  const handleSelect = async (option: string) => {
    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);

    // Persist to localStorage for guests
    if (!session) {
      localStorage.setItem("guest_user_context", JSON.stringify(newAnswers));
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Completed all questions
      setIsSaving(true);
      try {
        if (session?.user?.email) {
          const res = await fetch("/api/user-context", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context: newAnswers }),
          });
          if (!res.ok) throw new Error("Failed to save context");
        }
        
        setIsDone(true);
        setTimeout(() => {
          onComplete(newAnswers);
        }, 1500);
      } catch (err) {
        console.error(err);
        onComplete(newAnswers); // Fallback to proceeding anyway
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <div className="relative glass rounded-[2.5rem] p-12 text-center border-white/10 shadow-2xl">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-bold tracking-widest uppercase text-[10px]">Initializing Intelligence Phase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl glass rounded-[2.5rem] overflow-hidden border-white/10 shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Progress & Info */}
        <div className="w-full md:w-64 bg-gradient-to-br from-violet-600/20 to-transparent p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-2 leading-tight">Tailor Your Executive Team</h2>
            <p className="text-sm text-zinc-500 leading-relaxed italic">"Execution is in the details."</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Progress</span>
              <span className="text-xs font-bold text-violet-400">{Math.round(((step + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                 className="h-full bg-gradient-to-r from-violet-500 to-blue-500"
               />
            </div>
          </div>
        </div>

        {/* Right Side: Questions */}
        <div className="flex-1 p-8 sm:p-10 relative flex flex-col min-h-[400px]">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.div 
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Context Synchronized!</h3>
                <p className="text-zinc-500 max-w-[280px]">Your executive swarm is now optimized for your vision.</p>
              </motion.div>
            ) : isSaving ? (
              <motion.div 
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full" />
                  <Loader2 className="w-12 h-12 text-violet-400 animate-spin relative z-10" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white mb-2">Finalizing Intelligence...</h3>
                   <p className="text-xs text-zinc-500">Injecting business parameters into agent system prompts</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {(() => {
                      const IconMap: Record<string, any> = { target: Target, users: Users, zap: Zap, briefcase: Briefcase, globe: Globe, rocket: Rocket };
                      const Icon = currentQ.icon && IconMap[currentQ.icon as string] ? IconMap[currentQ.icon as string] : Sparkles;
                      return <Icon className="w-5 h-5 text-violet-400" />;
                    })()}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Question {step + 1} of {questions.length}</span>
                </div>

                <h3 className="text-2xl font-bold text-zinc-100 mb-8 leading-tight">
                  {currentQ.question}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options.map((option: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(option)}
                      className="w-full p-4 text-left glass rounded-2xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group flex items-center justify-between"
                    >
                      <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{option}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSaving && !isDone && (
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => step > 0 && setStep(step - 1)}
                disabled={step === 0}
                className="text-xs font-bold text-zinc-600 hover:text-white disabled:opacity-0 transition-all uppercase tracking-widest"
              >
                Previous Step
              </button>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-4 bg-violet-400' : 'bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
