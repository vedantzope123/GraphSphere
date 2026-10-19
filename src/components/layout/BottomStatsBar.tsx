import React, { useMemo } from "react";
import { useGraphStore } from "../../state/graphStore";
import { calculateGraphStats } from "../../utils/graphUtils";
import {
  Activity,
  Layers,
  Network,
  Split,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const BottomStatsBar: React.FC = () => {
  const store = useGraphStore();

  const stats = useMemo(() => {
    return calculateGraphStats(store.activeGraph);
  }, [store.activeGraph]);

  return (
    <footer className="h-10 px-4 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-md flex items-center justify-between text-xs overflow-x-auto z-20 text-slate-300">
      <div className="flex items-center gap-4 min-w-max">
        {/* Graph Meta */}
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <Network className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-sky-300">|V| = {stats.vertexCount}</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-sky-300">|E| = {stats.edgeCount}</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Average Degree */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Avg Deg:</span>
          <span className="font-mono font-medium text-emerald-400">{stats.averageDegree}</span>
        </div>

        {/* Density */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Density:</span>
          <span className="font-mono font-medium text-slate-200">{stats.density}</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Connectivity */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Components:</span>
          <span className="font-mono font-bold text-slate-200">{stats.componentCount}</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
              stats.isConnected
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                : "bg-amber-950/60 text-amber-400 border-amber-500/30"
            }`}
          >
            {stats.isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Planarity */}
        <div className="flex items-center gap-1.5" title={stats.planarityReason}>
          <span className="text-slate-400">Planar:</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
              stats.isPlanar
                ? "bg-sky-950/60 text-sky-400 border-sky-500/30"
                : "bg-rose-950/60 text-rose-400 border-rose-500/30"
            }`}
          >
            {stats.isPlanar ? "Yes" : "No"}
          </span>
        </div>

        {/* Bipartite */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Bipartite:</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
              stats.isBipartite
                ? "bg-purple-950/60 text-purple-400 border-purple-500/30"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            {stats.isBipartite ? "Yes (2-Colorable)" : "No"}
          </span>
        </div>

        {/* Euler */}
        <div className="flex items-center gap-1.5" title={stats.eulerStatusMessage}>
          <span className="text-slate-400">Euler:</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
              stats.hasEulerCircuit
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                : stats.hasEulerPath
                ? "bg-amber-950/60 text-amber-400 border-amber-500/30"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            {stats.hasEulerCircuit ? "Circuit" : stats.hasEulerPath ? "Path" : "None"}
          </span>
        </div>
      </div>

      {/* Right status badge */}
      <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 ml-4 font-mono">
        <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-ping" />
        <span>Graph: {store.activeGraph.name}</span>
      </div>
    </footer>
  );
};
