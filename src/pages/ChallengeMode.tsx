import React, { useState } from "react";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award,
} from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  topic: string;
  prompt: string;
  options: { label: string; isCorrect: boolean; explanation: string }[];
  hint: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Challenge 1: Campus Navigation & Dijkstra",
    topic: "Shortest Path",
    prompt:
      "On the campus road network, College connects to Library (2 km) and Hostel (5 km). Library connects to Canteen (3 km), Canteen to Ground (4 km), and Hostel to Ground (2 km). What is the minimum shortest distance from College to Ground?",
    options: [
      {
        label: "7 km (College → Hostel → Ground)",
        isCorrect: true,
        explanation:
          "Correct! 5 km (College → Hostel) + 2 km (Hostel → Ground) = 7 km. The alternate route via Library and Canteen is 2 + 3 + 4 = 9 km.",
      },
      {
        label: "9 km (College → Library → Canteen → Ground)",
        isCorrect: false,
        explanation: "Incorrect. 2 + 3 + 4 = 9 km, but the route via Hostel is only 7 km.",
      },
      {
        label: "6 km (Direct route)",
        isCorrect: false,
        explanation: "Incorrect. No direct road of length 6 km exists to Ground.",
      },
      {
        label: "11 km",
        isCorrect: false,
        explanation: "Incorrect. Suboptimal paths exist, but Dijkstra yields 7 km.",
      },
    ],
    hint: "Compare the sum of edge weights along College-Hostel-Ground versus College-Library-Canteen-Ground.",
  },
  {
    id: 2,
    title: "Challenge 2: Social Media Centrality",
    topic: "In-Degree & Directed Networks",
    prompt:
      "In a directed follower social network, how is an influencer's total follower count mathematically defined?",
    options: [
      {
        label: "In-Degree of the vertex (incoming directed edges)",
        isCorrect: true,
        explanation:
          "Correct! When user A follows user B, a directed edge points from A to B. Thus, followers correspond to incoming arrows (in-degree).",
      },
      {
        label: "Out-Degree of the vertex (outgoing directed edges)",
        isCorrect: false,
        explanation:
          "Incorrect. Out-degree represents accounts that this user follows (following count).",
      },
      {
        label: "Total Degree minus 2",
        isCorrect: false,
        explanation: "Incorrect. Total degree is the sum of in-degree and out-degree.",
      },
      {
        label: "Vertex eccentricity",
        isCorrect: false,
        explanation: "Incorrect. Eccentricity measures maximum shortest path distance in trees/metrics.",
      },
    ],
    hint: "If someone follows you, does the directed arrow point toward you or away from you?",
  },
  {
    id: 3,
    title: "Challenge 3: Graph Isomorphism Invariants",
    topic: "Isomorphism (G₁ ≅ G₂)",
    prompt:
      "Graph A and Graph B both have 6 vertices and 6 edges, and both have degree sequence [2, 2, 2, 2, 2, 2]. Are they guaranteed to be isomorphic?",
    options: [
      {
        label: "No, one could be a 6-cycle C₆ and the other two disjoint 3-cycles (2 × K₃)",
        isCorrect: true,
        explanation:
          "Correct! Having equal vertex counts, edge counts, and degree sequences is necessary but NOT sufficient for isomorphism. C₆ has 1 connected component, whereas 2 × K₃ has 2 connected components.",
      },
      {
        label: "Yes, identical degree sequences always prove isomorphism",
        isCorrect: false,
        explanation:
          "Incorrect. Degree sequences are necessary invariants, but not sufficient to guarantee structural isomorphism.",
      },
      {
        label: "Yes, because both graphs are 2-regular",
        isCorrect: false,
        explanation:
          "Incorrect. Multiple non-isomorphic 2-regular graphs can exist for the same order.",
      },
      {
        label: "Only if both graphs are directed",
        isCorrect: false,
        explanation: "Incorrect. The counterexample exists directly in undirected graphs.",
      },
    ],
    hint: "Think about connectivity: can a 2-regular graph on 6 vertices be disconnected?",
  },
  {
    id: 4,
    title: "Challenge 4: Eulerian Paths & Circuits",
    topic: "Eulerian Graphs",
    prompt:
      "According to Euler's theorem, under what condition does a connected undirected graph possess an Euler Path that is NOT a closed circuit?",
    options: [
      {
        label: "Exactly two vertices have odd degree",
        isCorrect: true,
        explanation:
          "Correct! The path must begin at one odd-degree vertex and terminate at the other odd-degree vertex. If 0 vertices have odd degree, an Euler Circuit exists.",
      },
      {
        label: "All vertices have even degree",
        isCorrect: false,
        explanation: "Incorrect. If all vertices have even degree, it has an Euler Circuit (starts and ends at the same vertex).",
      },
      {
        label: "Exactly four vertices have odd degree",
        isCorrect: false,
        explanation: "Incorrect. If more than 2 vertices have odd degree, no single Euler path can traverse all edges.",
      },
      {
        label: "The graph must be a complete graph Kₙ",
        isCorrect: false,
        explanation: "Incorrect. Complete graphs Kₙ have Euler paths only when n is odd or n = 2.",
      },
    ],
    hint: "Every intermediate vertex in an Euler path requires an edge to enter and an edge to leave (paired = even).",
  },
  {
    id: 5,
    title: "Challenge 5: Graph Coloring & Chromatic Number",
    topic: "Graph Coloring",
    prompt:
      "What is the exact chromatic number χ(K₄) for the complete graph on 4 vertices?",
    options: [
      {
        label: "χ(K₄) = 4",
        isCorrect: true,
        explanation:
          "Correct! In a complete graph Kₙ, every pair of vertices is connected by an edge. Therefore, no two vertices can share a color, requiring exactly n colors (χ(K₄) = 4).",
      },
      {
        label: "χ(K₄) = 2",
        isCorrect: false,
        explanation: "Incorrect. Only bipartite graphs have chromatic number 2. K₄ contains triangles (odd cycles).",
      },
      {
        label: "χ(K₄) = 3",
        isCorrect: false,
        explanation: "Incorrect. 3 colors can only color K₃; the 4th vertex is adjacent to all 3.",
      },
      {
        label: "χ(K₄) = 5",
        isCorrect: false,
        explanation: "Incorrect. K₄ only has 4 vertices in total.",
      },
    ],
    hint: "In a complete graph K₄, can any two vertices share the same color?",
  },
  {
    id: 6,
    title: "Challenge 6: The Three Utility Problem & Planarity",
    topic: "Planar Graphs & Kuratowski",
    prompt:
      "Why is the Three Utility Graph K₃,₃ mathematically proven to be non-planar in a 2D plane?",
    options: [
      {
        label: "Because K₃,₃ is bipartite (triangle-free) and requires |E| ≤ 2|V| - 4 = 8, but has 9 edges (9 > 8)",
        isCorrect: true,
        explanation:
          "Correct! In any bipartite planar graph, each face is bounded by at least 4 edges. By Euler's formula, |E| ≤ 2|V| - 4 = 2(6) - 4 = 8. Since K₃,₃ has 9 edges, at least one edge crossing is unavoidable in the plane. Kuratowski identifies K₃,₃ as a minimal non-planar minor.",
      },
      {
        label: "Because it contains an odd cycle of length 3",
        isCorrect: false,
        explanation: "Incorrect. K₃,₃ is bipartite and has NO odd cycles whatsoever.",
      },
      {
        label: "Because it has more than 10 vertices",
        isCorrect: false,
        explanation: "Incorrect. K₃,₃ has only 6 vertices (3 houses and 3 utilities).",
      },
      {
        label: "Because it is disconnected",
        isCorrect: false,
        explanation: "Incorrect. K₃,₃ is fully connected.",
      },
    ],
    hint: "Recall Euler's formula for bipartite (triangle-free) planar graphs: |E| ≤ 2|V| - 4.",
  },
];

export const ChallengeMode: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});

  const handleSelectOption = (challengeId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [challengeId]: optionIdx }));
  };

  const resetAll = () => {
    setUserAnswers({});
    setShowHint({});
  };

  const answeredCount = Object.keys(userAnswers).length;
  const score = Object.entries(userAnswers).reduce((acc, [cId, optIdx]) => {
    const ch = CHALLENGES.find((c) => c.id === Number(cId));
    if (ch && ch.options[optIdx]?.isCorrect) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0B1220] to-[#111827] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-semibold border border-[#F59E0B]/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>Interactive Evaluation</span>
          </div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">
            Graph Theory Challenge Mode
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl">
            Test your understanding across all modules: Dijkstra campus routing, social follower
            in-degrees, isomorphism invariants, Euler paths, graph coloring, and K₃,₃ non-planarity.
          </p>
        </div>

        {/* Live Score Counter */}
        <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#1E293B] flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F59E0B]" />
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase font-bold block">Score</span>
              <span className="text-base font-black text-[#F8FAFC]">
                {score} / {CHALLENGES.length} Correct
              </span>
            </div>
          </div>

          <button
            onClick={resetAll}
            className="p-1.5 rounded-lg bg-[#111827] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B] transition-colors"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        {CHALLENGES.map((ch) => {
          const selectedOptIdx = userAnswers[ch.id];
          const hasAnswered = selectedOptIdx !== undefined;
          const selectedOpt = hasAnswered ? ch.options[selectedOptIdx] : null;

          return (
            <div
              key={ch.id}
              className="p-6 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-4"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#38BDF8]">{ch.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B1220] text-[#94A3B8] border border-[#1E293B]">
                    {ch.topic}
                  </span>
                </div>

                <button
                  onClick={() => setShowHint((prev) => ({ ...prev, [ch.id]: !prev[ch.id] }))}
                  className="text-xs text-[#818CF8] hover:text-[#A5B4FC] flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint[ch.id] ? "Hide Hint" : "Need a Hint?"}</span>
                </button>
              </div>

              {/* Hint Box */}
              {showHint[ch.id] && (
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#818CF8]/30 text-xs text-[#818CF8]">
                  💡 <strong>Hint:</strong> {ch.hint}
                </div>
              )}

              {/* Prompt */}
              <p className="text-sm font-medium text-[#F8FAFC] leading-relaxed">{ch.prompt}</p>

              {/* Multiple Choice Options */}
              <div className="space-y-2 pt-1">
                {ch.options.map((opt, idx) => {
                  const isThisSelected = selectedOptIdx === idx;
                  let btnStyle = "bg-[#0B1220] hover:bg-[#1E293B] border-[#1E293B] text-[#94A3B8]";

                  if (hasAnswered) {
                    if (opt.isCorrect) {
                      btnStyle = "bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E] font-semibold";
                    } else if (isThisSelected && !opt.isCorrect) {
                      btnStyle = "bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444]";
                    }
                  } else if (isThisSelected) {
                    btnStyle = "bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(ch.id, idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt.label}</span>
                      {hasAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                      )}
                      {hasAnswered && isThisSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answering */}
              {hasAnswered && selectedOpt && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    selectedOpt.isCorrect
                      ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
                      : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
                  }`}
                >
                  <span className="font-bold block">
                    {selectedOpt.isCorrect ? "✓ Correct Evaluation:" : "✕ Explanation:"}
                  </span>
                  <p className="text-[#CBD5E1]">{selectedOpt.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
