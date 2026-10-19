import React, { useState, useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { ALL_PRESET_GRAPHS, GRAPH_ISO_A, GRAPH_ISO_B } from "../data/graphExamples";
import { compareGraphs } from "../utils/comparisonUtils";
import { cloneGraph } from "../utils/graphUtils";
import {
  GitCompare,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Scale,
  RefreshCw,
} from "lucide-react";

export const GraphComparison: React.FC = () => {
  const store = useGraphStore();

  const [selectedGraphAId, setSelectedGraphAId] = useState<string>(store.comparisonGraphA.id);
  const [selectedGraphBId, setSelectedGraphBId] = useState<string>(store.comparisonGraphB.id);

  const graphA = useMemo(() => {
    const found = ALL_PRESET_GRAPHS.find((g) => g.id === selectedGraphAId);
    return found ? cloneGraph(found) : store.comparisonGraphA;
  }, [selectedGraphAId, store.comparisonGraphA]);

  const graphB = useMemo(() => {
    const found = ALL_PRESET_GRAPHS.find((g) => g.id === selectedGraphBId);
    return found ? cloneGraph(found) : store.comparisonGraphB;
  }, [selectedGraphBId, store.comparisonGraphB]);

  // Comparison computation
  const comparisonResult = useMemo(() => {
    return compareGraphs(graphA, graphB);
  }, [graphA, graphB]);

  const handleSwapGraphs = () => {
    const temp = selectedGraphAId;
    setSelectedGraphAId(selectedGraphBId);
    setSelectedGraphBId(temp);
  };

  const handleLoadIsomorphicPair = () => {
    setSelectedGraphAId(GRAPH_ISO_A.id);
    setSelectedGraphBId(GRAPH_ISO_B.id);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-purple-400">
            <GitCompare className="w-4 h-4" />
            DUAL-VIEWPORT TOPOLOGICAL COMPARISON
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Side-by-Side Graph Comparison Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inspect two graph topologies simultaneously in 3D. Compare structural invariants, connectivity,
            planarity, eulerian paths, and execute rigorous graph isomorphism bijection detection.
          </p>
        </div>

        {/* Quick Isomorphic Demo Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadIsomorphicPair}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Isomorphic Demo Pair</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-slate-900/80 border border-slate-800 p-3 rounded-2xl shadow-xl">
        {/* Graph A Selector */}
        <div className="md:col-span-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300 shrink-0">Graph A:</span>
          <select
            value={selectedGraphAId}
            onChange={(e) => setSelectedGraphAId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-sky-300 font-semibold focus:outline-none focus:border-sky-500"
          >
            {ALL_PRESET_GRAPHS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (|V|={g.vertices.length}, |E|={g.edges.length})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapGraphs}
            title="Swap Graph A and B"
            className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Graph B Selector */}
        <div className="md:col-span-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300 shrink-0">Graph B:</span>
          <select
            value={selectedGraphBId}
            onChange={(e) => setSelectedGraphBId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-rose-300 font-semibold focus:outline-none focus:border-rose-500"
          >
            {ALL_PRESET_GRAPHS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (|V|={g.vertices.length}, |E|={g.edges.length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dual 3D Viewport Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Viewport: Graph A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-sky-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              GRAPH A: {graphA.name}
            </span>
            <span className="font-mono text-slate-400">
              |V| = {graphA.vertices.length} • |E| = {graphA.edges.length}
            </span>
          </div>
          <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D graph={graphA} titleBadge="Graph A" />
          </div>
        </div>

        {/* Right Viewport: Graph B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              GRAPH B: {graphB.name}
            </span>
            <span className="font-mono text-slate-400">
              |V| = {graphB.vertices.length} • |E| = {graphB.edges.length}
            </span>
          </div>
          <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D graph={graphB} titleBadge="Graph B" />
          </div>
        </div>
      </div>

      {/* Isomorphism Verdict Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
          comparisonResult.isomorphic
            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
            : "bg-slate-900/90 border-slate-800 text-slate-300"
        }`}
      >
        <div className="flex items-start gap-3">
          {comparisonResult.isomorphic ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Scale className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Isomorphism Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  comparisonResult.isomorphic
                    ? "bg-emerald-900/80 text-emerald-300 border border-emerald-500/50"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {comparisonResult.isomorphic ? "ISOMORPHIC (G_A ≅ G_B)" : "NON-ISOMORPHIC"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {comparisonResult.conclusion}
            </p>
          </div>
        </div>

        {/* Bijective mapping chips if isomorphic */}
        {comparisonResult.isomorphic && comparisonResult.vertexMappingLabels && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/30 text-xs shrink-0 max-w-md">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-1">
              Bijective Mapping $f(v)$:
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-[11px] text-slate-200">
              {Object.entries(comparisonResult.vertexMappingLabels).map(([a, b]) => (
                <span key={a} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {a} ↦ {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Topological & Structural Feature Comparison Matrix
          </span>
          <span className="text-[10px] font-mono text-slate-500">Live Computed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2 font-semibold">Category</th>
                <th className="pb-2 font-semibold">Feature Property</th>
                <th className="pb-2 font-semibold text-sky-400">Graph A</th>
                <th className="pb-2 font-semibold text-rose-400">Graph B</th>
                <th className="pb-2 font-semibold text-right">Alignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {comparisonResult.comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 text-slate-500 font-sans text-[11px]">{row.category}</td>
                  <td className="py-2.5 font-semibold text-slate-200 font-sans">{row.feature}</td>
                  <td className="py-2.5 text-sky-300">{row.valA}</td>
                  <td className="py-2.5 text-rose-300">{row.valB}</td>
                  <td className="py-2.5 text-right font-sans">
                    {row.status === "same" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Identical
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400 text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        Different
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
