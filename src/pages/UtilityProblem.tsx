import React, { useState } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { UTILITY_GRAPH } from "../data/utilityGraph";
import { checkPlanarity } from "../algorithms/planarity";
import {
  Home,
  Zap,
  Droplets,
  Flame,
  AlertTriangle,
  Sparkles,
  Rotate3d,
  Layers,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

export const UtilityProblem: React.FC = () => {
  const store = useGraphStore();
  const [viewDimension, setViewDimension] = useState<"3D" | "2D">("3D");

  const planarity = checkPlanarity(UTILITY_GRAPH);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
            <Home className="w-4 h-4" />
            CLASSIC MATHEMATICAL PUZZLE & KURATOWSKI MINOR
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            The Three Utility Problem (Complete Bipartite K₃,₃)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Suppose there are 3 houses and 3 utilities: Water, Gas, and Electricity. Can each house be
            connected to each utility with continuous lines such that no two lines cross?
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setViewDimension("3D")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewDimension === "3D"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>3D Uncrossed Orbit</span>
          </button>
          <button
            onClick={() => setViewDimension("2D")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewDimension === "2D"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Plane Crossing Proof</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Canvas Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D
              graph={UTILITY_GRAPH}
              titleBadge="K₃,₃ Complete Bipartite Graph"
              onVertexClick={(v) => store.setSelectedVertexId(v.id)}
            />
          </div>

          {/* Interactive Insight Callout */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <Sparkles className="w-4 h-4" />
              The 3D Spatial Breakthrough
            </div>
            <p className="leading-relaxed">
              In a flat 2-dimensional plane, the Jordan Curve Theorem forces at least one edge crossing when connecting all 9 utility pipelines ($3 \times 3 = 9$). However, by adding the 3rd dimension ($Z$-axis elevation or depth), utility conduits pass over or under each other with zero physical collision!
            </p>
          </div>
        </div>

        {/* Theoretical Proof Breakdown */}
        <div className="space-y-4">
          {/* Verdict Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Planarity Verdict
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                STRICTLY NON-PLANAR
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <div>
                <span className="font-semibold text-white">Graph Class:</span> Complete Bipartite K3,3
              </div>
              <div>
                <span className="font-semibold text-white">Partite Sets:</span>{" "}
                <span className="text-sky-300">3 Houses</span> and{" "}
                <span className="text-pink-300">3 Utilities</span>
              </div>
              <div>
                <span className="font-semibold text-white">Edges:</span> 9 incident connections
              </div>
            </div>
          </div>

          {/* Mathematical Proof Steps */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
              Rigorous Mathematical Proof
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="font-semibold text-amber-300 text-[11px] mb-1">
                  1. Bipartite Property
                </div>
                <p className="text-[11px] text-slate-400">
                  Because K3,3 is bipartite, it contains no odd cycles. Therefore, every face in any planar embedding must have degree at least 4 (2E ≥ 4F ⇒ F ≤ E/2).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="font-semibold text-amber-300 text-[11px] mb-1">
                  2. Euler's Planar Formula
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  V - E + F = 2 ⇒ E ≤ 2V - 4
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Plugging in |V| = 6:<br />
                  E ≤ 2(6) - 4 = 8.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <div className="font-semibold text-rose-300 text-[11px] mb-1">
                  3. The Contradiction
                </div>
                <p className="text-[11px] text-rose-200">
                  For K3,3, |E| = 9. But 9 ≤ 8 is false! Hence, K3,3 can never be drawn in a 2D plane without edge intersections.
                </p>
              </div>
            </div>
          </div>

          {/* Kuratowski Theorem Callout */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-bold text-slate-200">Kuratowski's Theorem (1930):</span> A finite graph is planar if and only if it does not contain a subgraph homeomorphic to or contracting to K5 or K3,3.
          </div>
        </div>
      </div>
    </div>
  );
};
