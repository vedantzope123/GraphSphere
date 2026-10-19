import React, { useState } from "react";
import { useGraphStore } from "../state/graphStore";
import { Trophy, CheckCircle2, XCircle, Sparkles, Award, ArrowRight, RotateCcw, HelpCircle } from "lucide-react";

interface Question {
  id: number;
  title: string;
  category: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CHALLENGES: Question[] = [
  {
    id: 1,
    title: "The Handshaking Lemma",
    category: "Degrees & Sums",
    prompt: "An undirected graph has 6 vertices, each having a degree of 4. According to the Handshaking Lemma, how many edges does the graph have?",
    options: ["24 edges", "12 edges", "8 edges", "6 edges"],
    correctIndex: 1,
    explanation: "By the Handshaking Lemma: Σ deg(v) = 2 · |E|. Here Σ deg(v) = 6 × 4 = 24. Thus |E| = 24 / 2 = 12 edges.",
  },
  {
    id: 2,
    title: "Campus Dijkstra Optimal Route",
    category: "Shortest Paths",
    prompt: "In the GraphSphere 3D Campus Road Network, what is the length of the shortest path from College Main to Ground?",
    options: ["5.0 km", "7.0 km (via Hostel)", "9.0 km (via Library & Canteen)", "11.0 km"],
    correctIndex: 1,
    explanation: "College ➔ Hostel (5 km) ➔ Ground (2 km) totals 7.0 km. The alternate route via Library (2) + Canteen (3) + Ground (4) equals 9.0 km.",
  },
  {
    id: 3,
    title: "Bipartite Cycles",
    category: "Bipartite & Coloring",
    prompt: "Which of the following cycle graphs is bipartite (2-colorable with no adjacent same-colored vertices)?",
    options: ["Triangle C₃", "Pentagon C₅", "Hexagon C₆", "Heptagon C₇"],
    correctIndex: 2,
    explanation: "A graph is bipartite if and only if it contains no odd cycles (Kőnig's Theorem). C₆ is an even cycle (length 6), hence it is bipartite.",
  },
  {
    id: 4,
    title: "Eulerian Path Condition",
    category: "Eulerian Graphs",
    prompt: "For an undirected connected graph to possess an Eulerian Path (a trail visiting every edge exactly once), how many odd-degree vertices can it have?",
    options: ["Exactly 0 or exactly 2", "Any odd number", "At least 4", "Only 1"],
    correctIndex: 0,
    explanation: "Euler proved that an undirected graph has an Euler Path if and only if it is connected and has either 0 odd vertices (Euler Circuit) or exactly 2 odd vertices (which act as start and end points).",
  },
  {
    id: 5,
    title: "The Three Utility Problem (K₃,₃)",
    category: "Planarity",
    prompt: "Why is the Three Utility Graph K₃,₃ non-planar?",
    options: [
      "Because it is disconnected",
      "Because Euler's planar formula requires E ≤ 2V - 4 (9 ≤ 8 fails for bipartite graphs)",
      "Because it has an odd cycle",
      "Because it has too few vertices",
    ],
    correctIndex: 1,
    explanation: "For any bipartite planar graph without triangles, each face has degree ≥ 4, giving E ≤ 2V - 4. For K₃,₃, V=6 and E=9. But 2(6) - 4 = 8, which violates 9 ≤ 8!",
  },
];

export const ChallengeQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const q = CHALLENGES[currentIdx];
  const isAnswered = selectedAnswers[q.id] !== undefined;
  const isCorrect = isAnswered && selectedAnswers[q.id] === q.correctIndex;

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    const updated = { ...selectedAnswers, [q.id]: optIdx };
    setSelectedAnswers(updated);
    setShowExplanation(true);
    if (optIdx === q.correctIndex) {
      setScore((s) => s + 100);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < CHALLENGES.length - 1) {
      setCurrentIdx((c) => c + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setScore(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-rose-400">
            <Trophy className="w-4 h-4" />
            GAMIFIED GRAPH THEORY LAB
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Challenges & Knowledge Quizzes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Test your understanding of the Handshaking Lemma, Dijkstra navigation, Bipartiteness, and Kuratowski's theorem.
          </p>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl shadow-lg shrink-0">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total XP</div>
            <div className="text-lg font-mono font-extrabold text-white">{score} XP</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-rose-500 transition-all duration-300"
            style={{ width: `${(answeredCount / CHALLENGES.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          {currentIdx + 1} / {CHALLENGES.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <span>QUESTION {q.id}</span>
            <span>•</span>
            <span>{q.category}</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
            {q.prompt}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            const hasChosen = isAnswered && selectedAnswers[q.id] === idx;
            const isRight = isAnswered && idx === q.correctIndex;
            const isWrong = hasChosen && !isRight;

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-between border ${
                  isRight
                    ? "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/50"
                    : isWrong
                    ? "bg-rose-950/70 border-rose-500 text-rose-200"
                    : "bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isRight && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isWrong && <XCircle className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner */}
        {showExplanation && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
              isCorrect
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                : "bg-rose-950/30 border-rose-500/40 text-rose-200"
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {isCorrect ? "Correct! +100 XP" : "Incorrect Solution"}
            </div>
            <div>{q.explanation}</div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleRestart}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Quiz</span>
          </button>

          {currentIdx < CHALLENGES.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/25 flex items-center gap-2 transition-all"
            >
              <span>Next Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Finish & Claim Score</span>
              <Trophy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
