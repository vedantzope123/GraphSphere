import React from "react";
import { useGraphStore } from "../../state/graphStore";
import { getVertexDegreeInfo } from "../../utils/degreeUtils";
import { X, Trash2, ArrowRight, Activity, MapPin, Hash, Sparkles } from "lucide-react";

export const InspectorDrawer: React.FC = () => {
  const store = useGraphStore();
  const { selectedVertexId, selectedEdgeId, activeGraph } = store;

  if (!selectedVertexId && !selectedEdgeId) return null;

  const vertex = selectedVertexId ? activeGraph.vertices.find((v) => v.id === selectedVertexId) : null;
  const edge = selectedEdgeId ? activeGraph.edges.find((e) => e.id === selectedEdgeId) : null;

  return (
    <div className="absolute right-3 top-20 w-80 max-h-[calc(100%-100px)] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-4 z-30 text-xs text-slate-200 animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-bold text-sm text-white">
            {vertex ? `Vertex: ${vertex.label}` : "Edge Inspector"}
          </span>
        </div>
        <button
          onClick={() => {
            store.setSelectedVertexId(null);
            store.setSelectedEdgeId(null);
          }}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Vertex Inspector Content */}
      {vertex && (
        <div className="mt-3 space-y-4">
          {/* Degree Cards */}
          {(() => {
            const deg = getVertexDegreeInfo(activeGraph, vertex.id);
            return (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">Degree</div>
                  <div className="text-lg font-mono font-bold text-sky-400">{deg.degree}</div>
                </div>
                {activeGraph.directed ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">In-Degree</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">{deg.inDegree}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Out-Degree</div>
                      <div className="text-lg font-mono font-bold text-purple-400">{deg.outDegree}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Isolated?</div>
                      <div className="text-xs font-semibold mt-1 text-slate-300">
                        {deg.isIsolated ? "Yes" : "No"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Pendant?</div>
                      <div className="text-xs font-semibold mt-1 text-slate-300">
                        {deg.isPendant ? "Yes (deg=1)" : "No"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          {/* Label & Type Form */}
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Vertex Label</label>
              <input
                type="text"
                value={vertex.label}
                onChange={(e) => store.updateVertex(vertex.id, { label: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Pos X</label>
                <input
                  type="number"
                  step="0.5"
                  value={vertex.position[0]}
                  onChange={(e) =>
                    store.updateVertex(vertex.id, {
                      position: [parseFloat(e.target.value) || 0, vertex.position[1], vertex.position[2]],
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Pos Y</label>
                <input
                  type="number"
                  step="0.5"
                  value={vertex.position[1]}
                  onChange={(e) =>
                    store.updateVertex(vertex.id, {
                      position: [vertex.position[0], parseFloat(e.target.value) || 0, vertex.position[2]],
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Pos Z</label>
                <input
                  type="number"
                  step="0.5"
                  value={vertex.position[2]}
                  onChange={(e) =>
                    store.updateVertex(vertex.id, {
                      position: [vertex.position[0], vertex.position[1], parseFloat(e.target.value) || 0],
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Neighbors List */}
          <div>
            <div className="text-[11px] font-semibold text-slate-300 mb-1.5">Direct Incident Neighbors</div>
            <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
              {activeGraph.edges
                .filter((e) => e.source === vertex.id || e.target === vertex.id)
                .map((e) => {
                  const isOutgoing = e.source === vertex.id;
                  const otherId = isOutgoing ? e.target : e.source;
                  const other = activeGraph.vertices.find((v) => v.id === otherId);
                  return (
                    <div
                      key={e.id}
                      onClick={() => store.setSelectedVertexId(otherId)}
                      className="px-2 py-1 rounded bg-slate-950/70 hover:bg-slate-800 cursor-pointer flex items-center justify-between border border-slate-850"
                    >
                      <span className="text-slate-300 font-medium">{other?.label || otherId}</span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        {activeGraph.directed ? (isOutgoing ? "→ Out" : "← In") : "Connected"}
                        {e.weight !== undefined && ` (${e.weight}km)`}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Delete Vertex Button */}
          <button
            onClick={() => store.removeVertex(vertex.id)}
            className="w-full mt-2 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Vertex & Edges
          </button>
        </div>
      )}

      {/* Edge Inspector Content */}
      {edge && (
        <div className="mt-3 space-y-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Connection</span>
              <span className="font-mono text-sky-400 font-semibold">
                {activeGraph.vertices.find((v) => v.id === edge.source)?.label}
                {edge.directed ? " ➔ " : " — "}
                {activeGraph.vertices.find((v) => v.id === edge.target)?.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Type</span>
              <span className="capitalize text-slate-300">{edge.type || "Default"}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Edge Weight (Distance/Cost)</label>
            <input
              type="number"
              step="0.5"
              value={edge.weight ?? 1}
              onChange={(e) => {
                const w = parseFloat(e.target.value);
                store.setActiveGraph((prev) => ({
                  ...prev,
                  edges: prev.edges.map((ed) => (ed.id === edge.id ? { ...ed, weight: w } : ed)),
                }));
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={() => store.removeEdge(edge.id)}
            className="w-full mt-2 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Edge
          </button>
        </div>
      )}
    </div>
  );
};
