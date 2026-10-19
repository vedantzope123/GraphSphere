import React, { useState, useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { getAllDegrees, verifyHandshakingLemma, calculateAverageDegree, calculateDensity } from "../utils/degreeUtils";
import { analyzeConnectivity } from "../algorithms/connectivity";
import { checkPlanarity } from "../algorithms/planarity";
import {
  BarChart3,
  Network,
  Split,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from "lucide-react";

interface GraphAnalysisProps {
  initialSubTab?: "overview" | "degree" | "connectivity" | "types";
}

export const GraphAnalysis: React.FC<GraphAnalysisProps> = ({ initialSubTab = "overview" }) => {
  const {
    activeGraph,
    selectedVertexId,
    setSelectedVertex,
  } = useGraphStore();

  const [activeTab, setActiveTab] = useState<"overview" | "degree" | "connectivity" | "types">(
    initialSubTab
  );

  const degrees = useMemo(() => getAllDegrees(activeGraph), [activeGraph]);
  const handshaking = useMemo(() => verifyHandshakingLemma(activeGraph), [activeGraph]);
  const conn = useMemo(() => analyzeConnectivity(activeGraph), [activeGraph]);
  const planarity = useMemo(() => checkPlanarity(activeGraph), [activeGraph]);

  const avgDeg = useMemo(() => calculateAverageDegree(activeGraph), [activeGraph]);
  const density = useMemo(() => calculateDensity(activeGraph), [activeGraph]);

  // Color map for connected components visualization
  const componentColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    const palette = ["#38BDF8", "#22C55E", "#F59E0B", "#A855F7", "#EC4899", "#14B8A6", "#EAB308"];
    conn.components.forEach((comp, idx) => {
      const color = palette[idx % palette.length];
      comp.forEach((vId) => {
        map[vId] = color;
      });
    });
    return map;
  }, [conn]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0B1220] to-[#111827] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/20">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Mathematical Analysis Suite</span>
          </div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">
            Live Graph Analysis & Invariants
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl">
            Live calculation of graph invariants: degree sequences, Handshaking Lemma,
            connected components, cyclic structure, planarity, and classification.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1220] border border-[#1E293B] flex-wrap">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "overview" ? "bg-[#38BDF8] text-[#050816]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("degree")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "degree" ? "bg-[#38BDF8] text-[#050816]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Degree & Handshaking
          </button>
          <button
            onClick={() => setActiveTab("connectivity")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "connectivity" ? "bg-[#38BDF8] text-[#050816]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Connectivity & Components
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "types" ? "bg-[#38BDF8] text-[#050816]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Classifications
          </button>
        </div>
      </div>

      {/* Main Analysis View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Canvas */}
        <div className="lg:col-span-7 space-y-3">
          <GraphCanvas3D
            graph={activeGraph}
            selectedVertexId={selectedVertexId}
            vertexColorMap={activeTab === "connectivity" ? componentColorMap : undefined}
            onSelectVertex={(id) => setSelectedVertex(id)}
            height="h-[480px]"
          />
          <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
            <span>
              {activeTab === "connectivity"
                ? "Vertices are tinted by their connected component partition."
                : "Select any vertex in 3D to inspect its individual degree metrics."}
            </span>
            <span className="text-[#38BDF8] font-medium">Model: {activeGraph.name}</span>
          </div>
        </div>

        {/* Dynamic Analysis Panel */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === "overview" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-4">
              <h3 className="text-sm font-bold text-[#F8FAFC]">Live Graph Invariants</h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Vertices |V|</span>
                  <span className="text-lg font-bold text-[#F8FAFC]">{activeGraph.vertices.length}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Edges |E|</span>
                  <span className="text-lg font-bold text-[#F8FAFC]">{activeGraph.edges.length}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Average Degree</span>
                  <span className="text-lg font-bold text-[#38BDF8]">{avgDeg}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Density</span>
                  <span className="text-lg font-bold text-[#818CF8]">{density}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Components</span>
                  <span className="text-lg font-bold text-[#22C55E]">{conn.componentCount}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Cycles</span>
                  <span className={`text-lg font-bold ${conn.hasCycle ? "text-[#F59E0B]" : "text-[#22C55E]"}`}>
                    {conn.hasCycle ? "Cyclic" : "Acyclic"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0B1220] border border-[#1E293B] space-y-1 text-xs">
                <span className="font-semibold text-[#F8FAFC]">Planarity Verdict:</span>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">{planarity.reason}</p>
              </div>
            </div>
          )}

          {activeTab === "degree" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-[#38BDF8]" />
                  Degree Analyzer
                </h3>
                <span className="text-[10px] text-[#22C55E] font-semibold bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30">
                  Handshaking Verified ✓
                </span>
              </div>

              {/* Handshaking Verification Banner */}
              <div className="p-3.5 rounded-lg bg-[#0B1220] border border-[#1E293B] space-y-1 text-xs">
                <span className="font-bold text-[#38BDF8] block text-[11px] uppercase tracking-wider">
                  Handshaking Lemma Proof:
                </span>
                <p className="font-mono text-[#F8FAFC] text-[11px] bg-[#050816] p-2 rounded">
                  {handshaking.equation}
                </p>
                <p className="text-[10px] text-[#64748B] pt-0.5">
                  In every graph, the sum of all degrees equals twice the number of edges. Consequently,
                  the number of odd-degree vertices must always be even.
                </p>
              </div>

              {/* Degree Table */}
              <div className="max-h-56 overflow-y-auto pr-1">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#1E293B] text-[10px] uppercase text-[#64748B]">
                      <th className="pb-1.5">Vertex</th>
                      <th className="pb-1.5">Degree</th>
                      <th className="pb-1.5">In</th>
                      <th className="pb-1.5">Out</th>
                      <th className="pb-1.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]/60">
                    {degrees.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedVertex(d.id)}
                        className={`cursor-pointer transition-colors hover:bg-[#1E293B]/30 ${
                          selectedVertexId === d.id ? "bg-[#38BDF8]/10 text-[#38BDF8] font-bold" : "text-[#94A3B8]"
                        }`}
                      >
                        <td className="py-1.5 font-medium">{d.label}</td>
                        <td className="py-1.5 font-mono">{d.degree}</td>
                        <td className="py-1.5 font-mono">{d.inDegree}</td>
                        <td className="py-1.5 font-mono">{d.outDegree}</td>
                        <td className="py-1.5 text-[10px]">
                          {d.isIsolated ? (
                            <span className="text-[#EF4444]">Isolated</span>
                          ) : d.isPendant ? (
                            <span className="text-[#F59E0B]">Pendant (Leaf)</span>
                          ) : (
                            <span className="text-[#64748B]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "connectivity" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-4">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <Split className="w-4 h-4 text-[#818CF8]" />
                Connectivity & Components
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Status</span>
                  <span className={`text-base font-bold ${conn.isConnected ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {conn.isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Components</span>
                  <span className="text-base font-bold text-[#F8FAFC]">
                    {conn.componentCount} Partitions
                  </span>
                </div>
              </div>

              {/* Components Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#94A3B8] block">
                  Component Partitions:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {conn.components.map((comp, idx) => {
                    const labels = comp.map(
                      (id) => activeGraph.vertices.find((v) => v.id === id)?.label || id
                    );
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#38BDF8]">Component #{idx + 1}</span>
                          <span className="text-[10px] text-[#64748B]">{comp.length} vertices</span>
                        </div>
                        <div className="font-mono text-[#F8FAFC] text-[11px]">
                          [{labels.join(", ")}]
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "types" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-4">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-[#22C55E]" />
                Graph Classifications
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-medium text-[#F8FAFC]">Regular Graph</span>
                  <span className={conn.isRegular ? "text-[#22C55E] font-bold" : "text-[#64748B]"}>
                    {conn.isRegular ? `Yes (${conn.regularDegree}-regular)` : "No"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-medium text-[#F8FAFC]">Complete Graph (K_n)</span>
                  <span className={conn.isComplete ? "text-[#22C55E] font-bold" : "text-[#64748B]"}>
                    {conn.isComplete ? "Yes (Complete)" : "No"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-medium text-[#F8FAFC]">Bipartite (2-Colorable)</span>
                  <span className={conn.isBipartite ? "text-[#22C55E] font-bold" : "text-[#64748B]"}>
                    {conn.isBipartite ? "Yes (No odd cycles)" : "No (Contains odd cycle)"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-medium text-[#F8FAFC]">Tree (Connected & Acyclic)</span>
                  <span className={conn.isTree ? "text-[#22C55E] font-bold" : "text-[#64748B]"}>
                    {conn.isTree ? "Yes (Tree)" : "No"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-medium text-[#F8FAFC]">Planar Embedding</span>
                  <span className={planarity.isPlanar ? "text-[#22C55E] font-bold" : "text-[#EF4444] font-bold"}>
                    {planarity.isPlanar ? "Planar ✓" : "Non-Planar ✕"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
