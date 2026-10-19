import React, { useState } from "react";
import { BookOpen, Sparkles, Scale, Cpu, Globe, CheckCircle2, ChevronDown } from "lucide-react";

export const AboutTheory: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>("handshaking");

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto text-slate-300">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-400">
          <BookOpen className="w-4 h-4" />
          DISCRETE MATHEMATICS & ALGORITHMS REFERENCE
        </div>
        <h1 className="text-2xl font-black text-white mt-1">Graph Theory Handbook & Theorems</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          A rigorous academic compendium detailing foundational definitions, classical theorems, proof
          sketches, computational complexities, and modern computing applications.
        </p>
      </div>

      {/* Real-World Mapping Summary Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Globe className="w-4 h-4 text-sky-400" />
          Real-World Mapping to Graph Abstractions
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2 font-semibold">Domain</th>
                <th className="pb-2 font-semibold text-sky-400">Vertices V</th>
                <th className="pb-2 font-semibold text-indigo-400">Edges E</th>
                <th className="pb-2 font-semibold">Edge Semantics</th>
                <th className="pb-2 font-semibold">Core Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 font-sans font-semibold text-white">Social Media</td>
                <td className="py-2.5 text-sky-300">User Accounts</td>
                <td className="py-2.5 text-indigo-300">Follow Relationships</td>
                <td className="py-2.5 font-sans text-slate-400">Directed Arc (A ➔ B)</td>
                <td className="py-2.5 text-emerald-400">In-Degree (Popularity)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 font-sans font-semibold text-white">The Web Graph</td>
                <td className="py-2.5 text-sky-300">HTML Documents</td>
                <td className="py-2.5 text-indigo-300">Hyperlinks</td>
                <td className="py-2.5 font-sans text-slate-400">Directed Arc (A ➔ B)</td>
                <td className="py-2.5 text-emerald-400">PageRank / Authority</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 font-sans font-semibold text-white">Campus Roads</td>
                <td className="py-2.5 text-sky-300">Buildings / Gates</td>
                <td className="py-2.5 text-indigo-300">Walkways / Roads</td>
                <td className="py-2.5 font-sans text-slate-400">Undirected Weighted (w ≥ 0)</td>
                <td className="py-2.5 text-emerald-400">Dijkstra Shortest Path</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 font-sans font-semibold text-white">Utility Networks</td>
                <td className="py-2.5 text-sky-300">Houses & Utilities</td>
                <td className="py-2.5 text-indigo-300">Conduits / Pipes</td>
                <td className="py-2.5 font-sans text-slate-400">Bipartite (K₃,₃)</td>
                <td className="py-2.5 text-emerald-400">Planarity & Crossings</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 font-sans font-semibold text-white">Compilers</td>
                <td className="py-2.5 text-sky-300">Variable Lifetimes</td>
                <td className="py-2.5 text-indigo-300">Interference</td>
                <td className="py-2.5 font-sans text-slate-400">Undirected (Conflict)</td>
                <td className="py-2.5 text-emerald-400">Chromatic Number χ(G)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Classical Theorems Accordion */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-purple-400" />
          Theorems & Proof Formulations
        </h2>

        {/* Handshaking Lemma */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleAccordion("handshaking")}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div>
              <span className="font-bold text-sm text-white">1. Handshaking Lemma</span>
              <span className="ml-2 text-xs text-sky-400 font-mono">Σ deg(v) = 2 · |E|</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                activeAccordion === "handshaking" ? "rotate-180" : ""
              }`}
            />
          </button>
          {activeAccordion === "handshaking" && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/60 leading-relaxed">
              <p>
                <strong>Proof:</strong> In any undirected graph, every edge connecting two nodes u and v contributes exactly 1 to the degree of vertex u and exactly 1 to the degree of vertex v. Therefore, summing the degrees across all vertices counts every edge exactly twice: Σ deg(v) = 2 · |E|.
              </p>
              <p className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-sky-300">
                Corollary: In every finite graph, the number of vertices with odd degree is always even.
              </p>
            </div>
          )}
        </div>

        {/* Euler's Planar Formula & Kuratowski */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleAccordion("planarity")}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div>
              <span className="font-bold text-sm text-white">2. Euler's Planar Polyhedral Formula & Kuratowski's Theorem</span>
              <span className="ml-2 text-xs text-amber-400 font-mono">V - E + F = 2</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                activeAccordion === "planarity" ? "rotate-180" : ""
              }`}
            />
          </button>
          {activeAccordion === "planarity" && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/60 leading-relaxed">
              <p>
                For any connected planar graph drawn without crossings, the relationship between vertices (V), edges (E), and faces (F, including the exterior unbounded face) satisfies V - E + F = 2.
              </p>
              <p>
                <strong>Kuratowski's Theorem (1930):</strong> A finite graph is planar if and only if it contains no subgraph homeomorphic to K₅ (complete 5-vertex graph) or K₃,₃ (three utility bipartite graph).
              </p>
            </div>
          )}
        </div>

        {/* Eulerian Path / Circuit */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleAccordion("euler")}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div>
              <span className="font-bold text-sm text-white">3. Eulerian Path & Circuit Theorem (Euler, 1736)</span>
              <span className="ml-2 text-xs text-emerald-400 font-mono">Königsberg Bridges</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                activeAccordion === "euler" ? "rotate-180" : ""
              }`}
            />
          </button>
          {activeAccordion === "euler" && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/60 leading-relaxed">
              <p>
                An undirected connected graph contains an <strong>Eulerian Circuit</strong> (closed trail visiting every edge exactly once) if and only if every vertex has an <strong>even degree</strong>.
              </p>
              <p>
                It contains an <strong>Eulerian Path</strong> (open trail) if and only if exactly <strong>two vertices</strong> have an odd degree (which serve as start and end vertices).
              </p>
            </div>
          )}
        </div>

        {/* Four Color Theorem */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
          <button
            onClick={() => toggleAccordion("coloring")}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div>
              <span className="font-bold text-sm text-white">4. The Four Color Theorem (Appel & Haken, 1976)</span>
              <span className="ml-2 text-xs text-pink-400 font-mono">χ(G) ≤ 4 for Planar</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                activeAccordion === "coloring" ? "rotate-180" : ""
              }`}
            />
          </button>
          {activeAccordion === "coloring" && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/60 leading-relaxed">
              <p>
                Given any separation of a plane into contiguous regions (such as a political map of countries), the regions may be colored using at most 4 colors so that no two regions sharing a common boundary border share the same color.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Algorithmic Complexity Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Cpu className="w-4 h-4 text-indigo-400" />
          Computational Complexity Benchmark
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2 font-semibold">Algorithm</th>
                <th className="pb-2 font-semibold">Target Problem</th>
                <th className="pb-2 font-semibold text-emerald-400">Time Complexity</th>
                <th className="pb-2 font-semibold text-sky-400">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 font-sans font-semibold text-white">Breadth-First Search (BFS)</td>
                <td className="py-2.5 font-sans text-slate-400">Shortest unweighted path, connectivity</td>
                <td className="py-2.5 text-emerald-400">O(|V| + |E|)</td>
                <td className="py-2.5 text-sky-300">O(|V|)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans font-semibold text-white">Depth-First Search (DFS)</td>
                <td className="py-2.5 font-sans text-slate-400">Cycle detection, topological sort</td>
                <td className="py-2.5 text-emerald-400">O(|V| + |E|)</td>
                <td className="py-2.5 text-sky-300">O(|V|)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans font-semibold text-white">Dijkstra's Algorithm</td>
                <td className="py-2.5 font-sans text-slate-400">Single-source weighted shortest path</td>
                <td className="py-2.5 text-emerald-400">O((|V| + |E|) log |V|)</td>
                <td className="py-2.5 text-sky-300">O(|V|)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans font-semibold text-white">Hierholzer's Algorithm</td>
                <td className="py-2.5 font-sans text-slate-400">Eulerian path & circuit extraction</td>
                <td className="py-2.5 text-emerald-400">O(|E|)</td>
                <td className="py-2.5 text-sky-300">O(|E|)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans font-semibold text-white">Welsh-Powell Greedy</td>
                <td className="py-2.5 font-sans text-slate-400">Heuristic vertex coloring χ(G)</td>
                <td className="py-2.5 text-emerald-400">O(|V| log |V| + |E|)</td>
                <td className="py-2.5 text-sky-300">O(|V|)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-sans font-semibold text-white">Hamiltonian Path / Cycle</td>
                <td className="py-2.5 font-sans text-slate-400">Visit every vertex once</td>
                <td className="py-2.5 text-rose-400">NP-Complete (O(2ⁿ · n²))</td>
                <td className="py-2.5 text-sky-300">O(|V|)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
