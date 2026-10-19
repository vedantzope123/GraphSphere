import React, { useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import {
  calculateAdjacencyMatrix,
  calculateAdjacencyList,
  calculateEdgeList,
} from "../utils/matrixUtils";
import { Table2, ListOrdered, Network, Sparkles, Layers } from "lucide-react";

export const Representation: React.FC = () => {
  const {
    activeGraph,
    selectedVertexId,
    selectedEdgeId,
    setSelectedVertex,
    setSelectedEdge,
  } = useGraphStore();

  const matrixData = useMemo(() => calculateAdjacencyMatrix(activeGraph), [activeGraph]);
  const adjList = useMemo(() => calculateAdjacencyList(activeGraph), [activeGraph]);
  const edgeList = useMemo(() => calculateEdgeList(activeGraph), [activeGraph]);

  // Find source/target for selected edge
  const selectedEdgeObj = useMemo(
    () => activeGraph.edges.find((e) => e.id === selectedEdgeId),
    [activeGraph, selectedEdgeId]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0B1220] to-[#111827] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/20">
            <Table2 className="w-3.5 h-3.5" />
            <span>Mathematical Data Structures</span>
          </div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">
            Graph Representations
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl">
            Inspect the current graph topology simultaneously as a 3D visual model,
            an Adjacency Matrix (A), an Adjacency List, and an Edge List. Clicking any edge or node
            synchronizes across all views.
          </p>
        </div>
      </div>

      {/* 3D Visualizer + Matrix / List Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Canvas */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#F8FAFC]">3D Spatial View</span>
            <span className="text-xs text-[#38BDF8]">
              {activeGraph.vertices.length} vertices • {activeGraph.edges.length} edges
            </span>
          </div>
          <GraphCanvas3D
            graph={activeGraph}
            selectedVertexId={selectedVertexId}
            selectedEdgeId={selectedEdgeId}
            onSelectVertex={(id) => setSelectedVertex(id)}
            onSelectEdge={(id) => setSelectedEdge(id)}
            height="h-[460px]"
          />
        </div>

        {/* Adjacency Matrix */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
              <Table2 className="w-4 h-4 text-[#38BDF8]" />
              Adjacency Matrix A ({matrixData.labels.length} × {matrixData.labels.length})
            </span>
            <span className="text-[11px] text-[#64748B]">
              {activeGraph.directed ? "Asymmetric (Directed)" : "Symmetric (A = Aᵀ)"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] overflow-x-auto max-h-[460px]">
            {matrixData.labels.length > 0 ? (
              <table className="text-xs font-mono border-collapse mx-auto">
                <thead>
                  <tr>
                    <th className="p-2 border-b border-r border-[#1E293B] text-[#64748B] bg-[#0B1220]">
                      V
                    </th>
                    {matrixData.labels.map((lbl, j) => (
                      <th
                        key={j}
                        className={`p-2 border-b border-[#1E293B] text-center min-w-[34px] ${
                          matrixData.ids[j] === selectedVertexId
                            ? "bg-[#38BDF8]/20 text-[#38BDF8] font-bold"
                            : "text-[#94A3B8]"
                        }`}
                      >
                        {lbl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixData.labels.map((rowLabel, i) => {
                    const rowId = matrixData.ids[i];
                    const isRowSelected = rowId === selectedVertexId;

                    return (
                      <tr key={i} className="hover:bg-[#1E293B]/40">
                        <td
                          className={`p-2 border-r border-[#1E293B] font-bold ${
                            isRowSelected
                              ? "bg-[#38BDF8]/20 text-[#38BDF8]"
                              : "text-[#94A3B8] bg-[#0B1220]"
                          }`}
                        >
                          {rowLabel}
                        </td>
                        {matrixData.matrix[i].map((val, j) => {
                          const colId = matrixData.ids[j];
                          const isColSelected = colId === selectedVertexId;
                          const isHighlightedEdge =
                            selectedEdgeObj &&
                            ((selectedEdgeObj.source === rowId && selectedEdgeObj.target === colId) ||
                              (!activeGraph.directed &&
                                selectedEdgeObj.source === colId &&
                                selectedEdgeObj.target === rowId));

                          const hasEdge = Number(val) > 0;

                          return (
                            <td
                              key={j}
                              className={`p-2 text-center border border-[#1E293B]/50 transition-colors ${
                                isHighlightedEdge
                                  ? "bg-[#22D3EE] text-[#050816] font-bold scale-110 shadow-lg"
                                  : isRowSelected && isColSelected
                                  ? "bg-[#818CF8]/30 text-[#818CF8]"
                                  : isRowSelected || isColSelected
                                  ? "bg-[#1E293B]/60"
                                  : ""
                              } ${hasEdge ? "text-[#38BDF8] font-bold" : "text-[#475569]"}`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <span className="text-xs text-[#64748B] italic">Graph has no vertices.</span>
            )}
          </div>
        </div>
      </div>

      {/* Adjacency List & Edge List Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adjacency List */}
        <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-[#818CF8]" />
              Adjacency List (v → Neighbors)
            </h3>
            <span className="text-[10px] text-[#64748B]">Memory: O(|V| + |E|)</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {adjList.map((entry) => {
              const isSelected = selectedVertexId === entry.vertexId;
              return (
                <div
                  key={entry.vertexId}
                  onClick={() => setSelectedVertex(entry.vertexId)}
                  className={`p-2.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8]"
                      : "bg-[#0B1220] border-[#1E293B] text-[#94A3B8] hover:border-[#475569]"
                  }`}
                >
                  <span className="font-bold text-[#F8FAFC]">{entry.vertexLabel} →</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {entry.neighbors.length > 0 ? (
                      entry.neighbors.map((n, idx) => (
                        <span
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEdge(n.edgeId);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            selectedEdgeId === n.edgeId
                              ? "bg-[#22D3EE] text-[#050816] font-bold"
                              : "bg-[#1E293B] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#050816]"
                          }`}
                        >
                          {n.targetLabel}
                          {n.weight !== undefined ? ` (${n.weight})` : ""}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#64748B] italic text-[11px]">∅ (isolated)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edge List */}
        <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-2">
              <Network className="w-4 h-4 text-[#22C55E]" />
              Edge List (E)
            </h3>
            <span className="text-[10px] text-[#64748B]">{edgeList.length} Total Edges</span>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {edgeList.map((e) => {
              const isSelected = selectedEdgeId === e.id;
              return (
                <div
                  key={e.id}
                  onClick={() => setSelectedEdge(e.id)}
                  className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#818CF8]/20 border-[#818CF8] text-[#818CF8] font-bold"
                      : "bg-[#0B1220] border-[#1E293B] text-[#94A3B8] hover:border-[#475569]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#F8FAFC] font-semibold">{e.sourceLabel}</span>
                    <span className="text-[#64748B]">{e.directed ? "→" : "—"}</span>
                    <span className="text-[#F8FAFC] font-semibold">{e.targetLabel}</span>
                  </div>
                  {e.weight !== undefined && (
                    <span className="px-2 py-0.5 rounded bg-[#111827] text-[#F59E0B] font-mono text-[10px] border border-[#1E293B]">
                      wt: {e.weight}
                    </span>
                  )}
                </div>
              );
            })}
            {edgeList.length === 0 && (
              <span className="text-xs text-[#64748B] italic">No edges present in graph.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
