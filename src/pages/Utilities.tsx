import React, { useMemo, useState } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { UTILITY_GRAPH } from "../data/utilityGraph";
import { GRAPH_K4, GRAPH_K5, GRAPH_C5, GRAPH_TREE } from "../data/graphExamples";
import { analyzeConnectivity } from "../algorithms/connectivity";
import { checkPlanarity } from "../algorithms/planarity";
import {
  Zap,
  Home,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
} from "lucide-react";

export const Utilities: React.FC = () => {
  const {
    activeGraph,
    setActiveGraph,
    selectedVertexId,
    setSelectedVertex,
    selectedEdgeId,
    setSelectedEdge,
  } = useGraphStore();

  React.useEffect(() => {
    if (activeGraph.category !== "utility" && activeGraph.id !== UTILITY_GRAPH.id) {
      setActiveGraph(UTILITY_GRAPH);
    }
  }, []);

  const isUtility = activeGraph.id === UTILITY_GRAPH.id;

  const conn = useMemo(() => analyzeConnectivity(activeGraph), [activeGraph]);
  const planarity = useMemo(() => checkPlanarity(activeGraph), [activeGraph]);

  // Selected item info
  const selectedVertex = useMemo(
    () => activeGraph.vertices.find((v) => v.id === selectedVertexId),
    [activeGraph, selectedVertexId]
  );

  const selectedEdge = useMemo(
    () => activeGraph.edges.find((e) => e.id === selectedEdgeId),
    [activeGraph, selectedEdgeId]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0B1220] to-[#111827] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-semibold border border-[#F59E0B]/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Classic Graph Theory Problem</span>
          </div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">
            Three Utility Problem & Complete Bipartite K3,3
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl">
            Can three houses each be connected to three utilities (Water, Electricity, Gas) without
            any pipes or cables crossing each other in a 2D plane?
          </p>
        </div>

        {!isUtility && (
          <button
            onClick={() => setActiveGraph(UTILITY_GRAPH)}
            className="px-3.5 py-1.5 rounded-lg bg-[#F59E0B] text-[#050816] font-semibold text-xs transition-colors cursor-pointer"
          >
            Load Three Utility K₃,₃
          </button>
        )}
      </div>

      {/* Mathematical Verdict Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vertices */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Vertices |V|
          </span>
          <div className="text-2xl font-black text-[#F8FAFC] mt-1">
            {activeGraph.vertices.length}
          </div>
          <span className="text-[11px] text-[#64748B]">3 Houses + 3 Utilities</span>
        </div>

        {/* Edges */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Edges |E|
          </span>
          <div className="text-2xl font-black text-[#F8FAFC] mt-1">
            {activeGraph.edges.length}
          </div>
          <span className="text-[11px] text-[#64748B]">3 × 3 = 9 connections</span>
        </div>

        {/* Bipartite Status */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Bipartite Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            {conn.isBipartite ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                <span className="text-xl font-bold text-[#22C55E]">Yes (2-Colorable)</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-[#EF4444]" />
                <span className="text-xl font-bold text-[#EF4444]">No</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-[#64748B]">Partition: Houses ↔ Utilities</span>
        </div>

        {/* Planar Status */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Planar Embedding
          </span>
          <div className="flex items-center gap-2 mt-1">
            {planarity.isPlanar ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                <span className="text-xl font-bold text-[#22C55E]">Planar ✓</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-[#EF4444]" />
                <span className="text-xl font-bold text-[#EF4444]">Non-Planar ✕</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-[#EF4444]/90 font-medium">Crossings Unavoidable</span>
        </div>
      </div>

      {/* Main 3D Canvas + Mathematical Proof Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-3">
          <GraphCanvas3D
            graph={activeGraph}
            selectedVertexId={selectedVertexId}
            selectedEdgeId={selectedEdgeId}
            onSelectVertex={(id) => setSelectedVertex(id)}
            onSelectEdge={(id) => setSelectedEdge(id)}
            height="h-[520px]"
          />
          <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
            <span>Click any house or utility node to highlight its incident connection lines.</span>
            <span className="text-[#F59E0B] font-medium">Every house connects to every utility</span>
          </div>
        </div>

        {/* Non-Planarity Proof & Kuratowski Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F8FAFC]">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              <span>Mathematical Proof of Non-Planarity</span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {planarity.reason}
            </p>

            <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B] space-y-2 text-xs">
              <span className="font-semibold text-[#F8FAFC] block text-[11px]">
                Euler's Formula for Triangle-Free Planar Graphs:
              </span>
              <div className="font-mono text-[#38BDF8] text-[11px] bg-[#050816] p-2 rounded">
                |E| ≤ 2|V| - 4
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                For K3,3: |V| = 6, |E| = 9.
                <br />
                2(6) - 4 = <span className="text-[#22C55E] font-bold">8</span>.
                <br />
                Since <span className="text-[#EF4444] font-bold">9 &gt; 8</span>, K3,3 violates Euler's
                planar inequality and cannot be embedded in a plane without edge crossings!
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs space-y-1">
              <span className="font-semibold text-[#F8FAFC] block text-[11px]">
                Kuratowski's Theorem (1930):
              </span>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                A finite graph is planar if and only if it contains no subgraph that is a
                subdivision of <span className="text-[#38BDF8] font-bold">K₅</span> or{" "}
                <span className="text-[#F59E0B] font-bold">K3,3</span>.
              </p>
            </div>
          </div>

          {/* Planar vs Non-Planar Benchmark Presets */}
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
            <span className="text-xs font-bold text-[#F8FAFC] block">
              Planar vs Non-Planar Benchmarks
            </span>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setActiveGraph(GRAPH_K4)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] text-left text-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Complete K₄ (4 nodes, 6 edges)</span>
                <span className="text-[#22C55E] font-bold">Planar ✓</span>
              </button>

              <button
                onClick={() => setActiveGraph(GRAPH_C5)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] text-left text-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Cycle C₅ (5 nodes, 5 edges)</span>
                <span className="text-[#22C55E] font-bold">Planar ✓</span>
              </button>

              <button
                onClick={() => setActiveGraph(GRAPH_TREE)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] text-left text-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Binary Tree (7 nodes, 6 edges)</span>
                <span className="text-[#22C55E] font-bold">Planar ✓</span>
              </button>

              <button
                onClick={() => setActiveGraph(GRAPH_K5)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] text-left text-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Complete K₅ (5 nodes, 10 edges)</span>
                <span className="text-[#EF4444] font-bold">Non-Planar ✕</span>
              </button>

              <button
                onClick={() => setActiveGraph(UTILITY_GRAPH)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] text-left text-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Utility K₃,₃ (6 nodes, 9 edges)</span>
                <span className="text-[#EF4444] font-bold">Non-Planar ✕</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
