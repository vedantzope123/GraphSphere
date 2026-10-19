import React, { useState, useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { colorGraphWelshPowell, COLOR_PALETTE } from "../algorithms/coloring";
import {
  Palette,
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const Coloring: React.FC = () => {
  const { activeGraph } = useGraphStore();

  const [isColored, setIsColored] = useState<boolean>(true);

  // Run Welsh-Powell algorithm
  const coloring = useMemo(() => {
    return colorGraphWelshPowell(activeGraph);
  }, [activeGraph]);

  // Map vertex colors to hex for 3D canvas
  const vertexColorMap = useMemo(() => {
    if (!isColored) return {};
    const map: Record<string, string> = {};
    Object.entries(coloring.vertexColors).forEach(([vId, colorIdx]) => {
      map[vId] = coloring.colorHexMap[colorIdx] || "#38BDF8";
    });
    return map;
  }, [coloring, isColored]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0B1220] to-[#111827] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#A855F7]/10 text-[#A855F7] text-xs font-semibold border border-[#A855F7]/20">
            <Palette className="w-3.5 h-3.5" />
            <span>Vertex Coloring Lab</span>
          </div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">
            Graph Coloring & Chromatic Number
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl">
            Assign colors to vertices such that no two adjacent vertices share the same color.
            Computed using the deterministic Welsh-Powell degree-descending greedy heuristic.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsColored(!isColored)}
            className="px-4 py-2 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-[#050816] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            <span>{isColored ? "Reset Colors" : "Auto Color (Welsh-Powell)"}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Colors Used */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Greedy Colors Used (k)
          </span>
          <div className="text-2xl font-black text-[#38BDF8] mt-1">
            {isColored ? coloring.colorsUsed : 0} Colors
          </div>
          <span className="text-[11px] text-[#64748B]">Welsh-Powell heuristic</span>
        </div>

        {/* Exact Chromatic Number */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Chromatic Number χ(G)
          </span>
          <div className="text-2xl font-black text-[#A855F7] mt-1">
            {coloring.chromaticNumberKnown !== undefined ? `χ = ${coloring.chromaticNumberKnown}` : "k-bounded"}
          </div>
          <span className="text-[11px] text-[#64748B]">
            {coloring.chromaticNumberKnown !== undefined ? "Analytically proven" : "Upper bounded by Δ(G) + 1"}
          </span>
        </div>

        {/* Proper Coloring Verification */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Proper Coloring Check
          </span>
          <div className="flex items-center gap-2 mt-1">
            {coloring.isProperColoring ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                <span className="text-lg font-bold text-[#22C55E]">Valid (0 Conflicts)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-[#EF4444]" />
                <span className="text-lg font-bold text-[#EF4444]">Conflict Detected</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-[#64748B]">No adjacent nodes share color</span>
        </div>

        {/* Max Degree Bound */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
            Brooks' Theorem Upper Bound
          </span>
          <div className="text-2xl font-black text-[#F59E0B] mt-1">
            Δ(G) + 1
          </div>
          <span className="text-[11px] text-[#64748B]">Max colors needed</span>
        </div>
      </div>

      {/* 3D Visualizer + Color Table Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-3">
          <GraphCanvas3D
            graph={activeGraph}
            vertexColorMap={vertexColorMap}
            height="h-[520px]"
          />
          <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
            <span>Vertices with matching colors form independent vertex sets with no incident edges.</span>
            <span className="text-[#A855F7] font-medium">Welsh-Powell greedy sort: high degree first</span>
          </div>
        </div>

        {/* Practical Application: Exam & Timetable Scheduling */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
            <h3 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              Real-World Application: Exam Scheduling
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              In college timetable scheduling, courses are vertices, and an edge connects any two
              courses with enrolled student overlap (a conflict).
            </p>
            <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs space-y-1">
              <span className="font-semibold text-[#F8FAFC]">Academic Takeaway:</span>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                The minimum number of exam time slots needed without student conflicts equals
                the <strong className="text-[#38BDF8]">chromatic number χ(G)</strong>.
                Here, <strong className="text-[#A855F7]">{coloring.colorsUsed} time slots</strong>{" "}
                are sufficient for all vertices.
              </p>
            </div>
          </div>

          {/* Color Assignment Breakdown */}
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
            <span className="text-xs font-bold text-[#F8FAFC] block">
              Color Assignment Breakdown
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {Array.from({ length: coloring.colorsUsed }).map((_, cIdx) => {
                const hex = coloring.colorHexMap[cIdx];
                const memberVertices = activeGraph.vertices
                  .filter((v) => coloring.vertexColors[v.id] === cIdx)
                  .map((v) => v.label);

                return (
                  <div
                    key={cIdx}
                    className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1E293B] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block flex-shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="font-bold text-[#F8FAFC]">Color #{cIdx + 1}</span>
                    </div>
                    <div className="font-mono text-[#94A3B8] text-[11px] text-right truncate max-w-[180px]">
                      {memberVertices.join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theoretical Guarantee */}
          <div className="p-4 rounded-xl bg-[#0B1220] border border-[#1E293B] text-xs text-[#94A3B8] space-y-1">
            <span className="font-semibold text-[#F8FAFC] block text-[11px]">
              Theorem Guarantee:
            </span>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              {coloring.chromaticNumberExplanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
