import React, { useState, useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { colorGraphWelshPowell, COLOR_PALETTE } from "../algorithms/coloring";
import { Graph } from "../types/graph";
import {
  Palette,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Layers,
} from "lucide-react";

// Exam Scheduling Dataset
const EXAM_SCHEDULE_GRAPH: Graph = {
  id: "exam_scheduling_demo",
  name: "Exam Timetable Scheduling (Conflict Graph)",
  description: "Vertices represent university exams. Edges represent overlapping student enrollments. Distinct colors represent disjoint timeslots.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "c_cs101", label: "CS101 (Data Structures)", position: [-3, 2, 0] },
    { id: "c_math201", label: "MATH201 (Linear Algebra)", position: [0, 3, 1] },
    { id: "c_phy101", label: "PHY101 (Physics)", position: [3, 2, -1] },
    { id: "c_chem101", label: "CHEM101 (Chemistry)", position: [-2, -2, 2] },
    { id: "c_eng102", label: "ENG102 (Technical Writing)", position: [2, -2, 1] },
    { id: "c_bio105", label: "BIO105 (Genetics)", position: [0, -3, -2] },
  ],
  edges: [
    { id: "ex_1", source: "c_cs101", target: "c_math201", directed: false },
    { id: "ex_2", source: "c_cs101", target: "c_phy101", directed: false },
    { id: "ex_3", source: "c_math201", target: "c_phy101", directed: false },
    { id: "ex_4", source: "c_math201", target: "c_chem101", directed: false },
    { id: "ex_5", source: "c_chem101", target: "c_bio105", directed: false },
    { id: "ex_6", source: "c_phy101", target: "c_eng102", directed: false },
    { id: "ex_7", source: "c_eng102", target: "c_bio105", directed: false },
  ],
};

export const GraphColoring: React.FC = () => {
  const store = useGraphStore();
  const [activeColored, setActiveColored] = useState(true);

  // Compute Welsh-Powell coloring for active graph
  const coloringResult = useMemo(() => {
    return colorGraphWelshPowell(store.activeGraph);
  }, [store.activeGraph]);

  const customNodeColors = useMemo(() => {
    if (!activeColored) return undefined;
    const colors: Record<string, string> = {};
    Object.entries(coloringResult.vertexColors).forEach(([vId, colorIdx]) => {
      colors[vId] = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
    });
    return colors;
  }, [activeColored, coloringResult]);

  const handleLoadExamScheduling = () => {
    store.setActiveGraph(EXAM_SCHEDULE_GRAPH);
    setActiveColored(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-pink-400">
            <Palette className="w-4 h-4" />
            VERTEX COLORING & CHROMATIC NUMBER χ(G)
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Graph Coloring & Conflict Scheduling
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Assign colors to vertices such that no two adjacent vertices share the same color.
            The minimum colors needed is the <span className="text-pink-300 font-semibold">Chromatic Number $\chi(G)$</span>.
            Crucial for compiler register allocation, frequency assignment, and exam timetables.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveColored(!activeColored)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all ${
              activeColored
                ? "bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{activeColored ? "Colors Applied" : "Apply Auto Color"}</span>
          </button>

          <button
            onClick={handleLoadExamScheduling}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Load Exam Timetable Model</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D View + Coloring Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D
              customVertexColors={customNodeColors}
              titleBadge={`Welsh-Powell Coloring (${coloringResult.colorsUsed} Colors Used)`}
            />
          </div>

          {/* Color Palette Legend */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Color Partitions (Independent Sets / Timeslots)
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {Array.from({ length: coloringResult.colorsUsed }).map((_, cIdx) => {
                const hex = COLOR_PALETTE[cIdx % COLOR_PALETTE.length];
                const members = Object.entries(coloringResult.vertexColors)
                  .filter(([_, color]) => color === cIdx)
                  .map(([vId]) => store.activeGraph.vertices.find((v) => v.id === vId)?.label || vId);

                return (
                  <div
                    key={cIdx}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs font-mono"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: hex }}
                    />
                    <div>
                      <span className="font-bold text-white">Timeslot #{cIdx + 1}:</span>{" "}
                      <span className="text-slate-400 font-sans">{members.join(", ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Analysis & Chromatic Theorems */}
        <div className="space-y-4">
          {/* Validity & Chromatic Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Coloring Validity
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                PROPER COLORING
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Colors Used:</span>
                <span className="font-mono font-bold text-pink-400 text-sm">
                  {coloringResult.colorsUsed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Conflict Edges:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {coloringResult.conflictEdges.length} (Zero Conflicts)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 pt-2 border-t border-slate-800 leading-relaxed">
              {coloringResult.chromaticNumberExplanation}
            </p>
          </div>

          {/* Real-World Exam Scheduling Application */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Real-World Timetable Scheduling
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In college scheduling, each exam is a vertex. If any student is enrolled in both Course A and Course B, an edge connects them.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 space-y-1 font-mono">
              <div>• Vertices = Exams / Courses</div>
              <div>• Edges = Student Overlaps</div>
              <div>• Colors = Exam Time Slots</div>
              <div className="text-emerald-400 font-bold">
                &rArr; Minimum time slots required = &chi;(G)
              </div>
            </div>
          </div>

          {/* Famous Theorems Reference */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              Four Color Theorem (1976)
            </span>
            <p className="text-[11px] leading-relaxed">
              Every planar graph can be colored using at most 4 colors ($\chi(G) \le 4$). Proved by Appel & Haken using computer-assisted exhaustive reduction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
