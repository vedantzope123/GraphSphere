import React, { useState } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import {
  DEFAULT_STARTER_GRAPH,
  GRAPH_K4,
  GRAPH_K5,
  GRAPH_ISO_A,
  GRAPH_ISO_B,
} from "../data/graphExamples";
import { CAMPUS_GRAPH } from "../data/campusGraph";
import { UTILITY_GRAPH } from "../data/utilityGraph";
import { SOCIAL_GRAPH_A } from "../data/socialGraphs";
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  graph: any;
  bullets: string[];
  formula?: string;
  realWorldNote: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Introduction to Graph Theory: G = (V, E)",
    subtitle: "Mathematical formalization of interconnected systems",
    graph: DEFAULT_STARTER_GRAPH,
    formula: "G = (V, E) \\quad \\text{where } V = \\{v_1, \\dots, v_n\\}, E \\subseteq V \\times V",
    bullets: [
      "A graph is a discrete mathematical structure consisting of a set of vertices (nodes) and edges (links).",
      "Undirected graphs have bidirectional edges: (u, v) = (v, u).",
      "Directed graphs (digraphs) enforce orientation: (u, v) represents an arc from source u to target v.",
      "Weights w(e) quantify distance, transmission latency, or travel financial cost.",
    ],
    realWorldNote: "Every computer network, social media feed, and transit map is an instance of G=(V,E).",
  },
  {
    id: 2,
    title: "Vertex Degree & The Handshaking Lemma",
    subtitle: "Fundamental Theorem of Graph Theory (Leonhard Euler, 1736)",
    graph: GRAPH_K4,
    formula: "\\sum_{v \\in V} \\text{deg}(v) = 2 \\cdot |E|",
    bullets: [
      "The degree of a vertex deg(v) is the count of incident edges.",
      "Because every undirected edge has exactly two endpoints, the sum of all degrees is precisely twice the number of edges.",
      "Corollary: The number of odd-degree vertices in any graph must be EVEN.",
      "For directed graphs: Σ In-Degree = Σ Out-Degree = |E|.",
    ],
    realWorldNote: "Explains why whenever friends shake hands at a gathering, the total number of handshakes given is always even.",
  },
  {
    id: 3,
    title: "Directed Influence & The Web Graph",
    subtitle: "In-Degree as authority and Out-Degree as citations",
    graph: SOCIAL_GRAPH_A,
    formula: "\\text{In-Deg}(v) = |\\{u \\in V : (u, v) \\in E\\}|",
    bullets: [
      "In social networks, follower counts directly equal In-Degree in a directed graph.",
      "In the World Wide Web, incoming hyperlinks are backlinks.",
      "Larry Page & Sergey Brin generalized In-Degree into PageRank: a page is important if important pages point to it.",
    ],
    realWorldNote: "Forms the multi-billion dollar foundation of search engine indexing and social network recommendation feeds.",
  },
  {
    id: 4,
    title: "Optimal Routing: Dijkstra's Algorithm",
    subtitle: "Greedy shortest-path search in weighted networks",
    graph: CAMPUS_GRAPH,
    formula: "d[v] = \\min \\big(d[v], \\; d[u] + w(u, v)\\big)",
    bullets: [
      "Finds shortest paths from a single source to all other vertices in non-negative edge weighted graphs.",
      "Maintains a min-priority queue of tentative distances.",
      "Demonstrated on campus: College to Ground selects College ➔ Hostel (5) ➔ Ground (2) = 7.0 km.",
      "Runs in O(|E| + |V| log |V|) using Fibonacci heaps.",
    ],
    realWorldNote: "Powers Google Maps route generation, OSPF internet routing, and Uber driver dispatch.",
  },
  {
    id: 5,
    title: "Planarity & The Three Utility Problem",
    subtitle: "Kuratowski's Theorem and Euler's Polyhedral Formula",
    graph: UTILITY_GRAPH,
    formula: "V - E + F = 2 \\implies E \\le 2V - 4 \\quad (\\text{for bipartite graphs})",
    bullets: [
      "A graph is planar if it can be drawn in a 2D plane without edge crossings.",
      "For K₃,₃ (3 houses, 3 utilities): |V|=6, |E|=9. But 2(6) - 4 = 8 < 9!",
      "Hence, K₃,₃ is strictly non-planar.",
      "In 3D spatial orbit, the conduits elevate along the Z-axis, completely resolving the collision!",
    ],
    realWorldNote: "Printed circuit board (PCB) design uses multi-layer 3D vias to route traces without short-circuiting.",
  },
  {
    id: 6,
    title: "Graph Isomorphism & Structural Equivalence",
    subtitle: "When are two graphs topologically identical?",
    graph: GRAPH_ISO_A,
    formula: "G_A \\cong G_B \\iff \\exists f: V(A) \\to V(B) \\text{ preserving adjacency}",
    bullets: [
      "Two graphs are isomorphic if there exists a bijective mapping preserving all edge connections.",
      "Necessary invariants: matching |V|, |E|, degree sequences, and connected components.",
      "A major open question in computational complexity (Quasi-polynomial time by Babai, 2016).",
    ],
    realWorldNote: "Chemical isomer detection in pharmacology to verify molecular graph identicalness.",
  },
];

export const PresentationMode: React.FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const slide = SLIDES[currentSlideIdx];

  const handleNext = () => {
    if (currentSlideIdx < SLIDES.length - 1) setCurrentSlideIdx((c) => c + 1);
  };

  const handlePrev = () => {
    if (currentSlideIdx > 0) setCurrentSlideIdx((c) => c - 1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-400">
            <Presentation className="w-4 h-4" />
            CLASSROOM LECTURE & UNIVERSITY PRESENTATION DECK
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Graph Theory Interactive Lecture Series
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            6 interactive lecture slides featuring live embedded 3D models for academic teaching and demonstration.
          </p>
        </div>

        {/* Slide Counter & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlideIdx === 0}
            className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold text-slate-200">
            Slide {currentSlideIdx + 1} / {SLIDES.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentSlideIdx === SLIDES.length - 1}
            className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        {/* Slide Title Bar */}
        <div>
          <span className="text-[11px] font-mono text-sky-400 uppercase tracking-widest font-bold">
            LECTURE MODULE #{slide.id}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {slide.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">{slide.subtitle}</p>
        </div>

        {/* Slide Body: 3D Model + Bullet Points */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Live 3D Model */}
          <div className="h-[360px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-xl">
            <GraphCanvas3D graph={slide.graph} titleBadge={`Slide 3D Model`} />
          </div>

          {/* Academic Content */}
          <div className="space-y-4">
            {slide.formula && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center text-xs md:text-sm text-sky-300 font-semibold shadow-inner">
                {slide.formula}
              </div>
            )}

            <div className="space-y-2 text-xs md:text-sm text-slate-300">
              {slide.bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                  <span className="leading-relaxed">{b}</span>
                </div>
              ))}
            </div>

            {/* Real World Impact Callout */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
              <span className="font-bold text-indigo-300">Engineering Application: </span>
              {slide.realWorldNote}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
