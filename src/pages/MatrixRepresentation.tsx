import React, { useState, useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import {
  getAdjacencyMatrix,
  getAdjacencyList,
  getEdgeList,
  getIncidenceMatrix,
} from "../utils/matrixUtils";
import {
  TableProperties,
  ListFilter,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Columns,
} from "lucide-react";

export const MatrixRepresentation: React.FC = () => {
  const store = useGraphStore();
  const [activeRepTab, setActiveRepTab] = useState<"matrix" | "adjList" | "edgeList" | "incidence">("matrix");
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const adjMatrix = useMemo(() => getAdjacencyMatrix(store.activeGraph), [store.activeGraph]);
  const adjList = useMemo(() => getAdjacencyList(store.activeGraph), [store.activeGraph]);
  const edgeList = useMemo(() => getEdgeList(store.activeGraph), [store.activeGraph]);
  const incidenceMatrix = useMemo(() => getIncidenceMatrix(store.activeGraph), [store.activeGraph]);

  const handleCellHover = (rowIdx: number, colIdx: number) => {
    setHoveredCell({ row: rowIdx, col: colIdx });
    const u = adjMatrix.ids[rowIdx];
    const v = adjMatrix.ids[colIdx];
    store.setHighlightedPath([u, v]);

    // Find edge between u and v
    const edge = store.activeGraph.edges.find(
      (e) => (e.source === u && e.target === v) || (!store.activeGraph.directed && e.source === v && e.target === u)
    );
    if (edge) store.setHighlightedEdges([edge.id]);
    else store.setHighlightedEdges([]);
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
    store.setHighlightedPath([]);
    store.setHighlightedEdges([]);
  };

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    const u = adjMatrix.ids[rowIdx];
    const v = adjMatrix.ids[colIdx];
    if (u === v) return; // ignore self-loops for simple toggle

    const existingEdge = store.activeGraph.edges.find(
      (e) => (e.source === u && e.target === v) || (!store.activeGraph.directed && e.source === v && e.target === u)
    );

    if (existingEdge) {
      store.removeEdge(existingEdge.id);
    } else {
      store.addEdge({
        source: u,
        target: v,
        directed: store.activeGraph.directed,
        weight: store.activeGraph.weighted ? 1 : undefined,
      });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-400">
            <TableProperties className="w-4 h-4" />
            DISCRETE MATHEMATICS DATA STRUCTURES
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Graph Representations & Matrix Memory Models
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Graphs can be mathematically stored in memory using Adjacency Matrices, Adjacency Lists, or Edge
            Lists. Hover over matrix cells to highlight incident vertices in the 3D canvas, or click any cell
            to toggle the edge directly!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveRepTab("matrix")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeRepTab === "matrix" ? "bg-sky-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Adjacency Matrix
          </button>
          <button
            onClick={() => setActiveRepTab("adjList")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeRepTab === "adjList" ? "bg-sky-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Adjacency List
          </button>
          <button
            onClick={() => setActiveRepTab("edgeList")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeRepTab === "edgeList" ? "bg-sky-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Edge List
          </button>
          <button
            onClick={() => setActiveRepTab("incidence")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeRepTab === "incidence" ? "bg-sky-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Incidence Matrix
          </button>
        </div>
      </div>

      {/* Main Grid: 3D View + Data Structure Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Canvas Column */}
        <div className="space-y-3">
          <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D titleBadge="Synchronized 3D Topology" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Hover over matrix cells to inspect edge connections in 3D.</span>
            </div>
            <span className="font-mono text-slate-500 text-[11px]">
              {store.activeGraph.directed ? "Directed (Asymmetric)" : "Undirected (Symmetric)"}
            </span>
          </div>
        </div>

        {/* Representation Table Column */}
        <div className="space-y-4">
          {/* Adjacency Matrix View */}
          {activeRepTab === "matrix" && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TableProperties className="w-4 h-4 text-sky-400" />
                  Adjacency Matrix A (|V| × |V|)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Space: O(V²) • Lookup: O(1)
                </span>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="border-collapse text-center text-xs font-mono">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-800/80 bg-slate-950 text-slate-500 text-[10px]">
                        $V_i \backslash V_j$
                      </th>
                      {adjMatrix.labels.map((lbl, idx) => (
                        <th
                          key={idx}
                          className={`p-2 border border-slate-800/80 bg-slate-950 font-bold transition-colors ${
                            hoveredCell?.col === idx ? "text-sky-300 bg-sky-950/60" : "text-slate-400"
                          }`}
                        >
                          {lbl}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adjMatrix.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td
                          className={`p-2 border border-slate-800/80 bg-slate-950 font-bold transition-colors ${
                            hoveredCell?.row === rIdx ? "text-sky-300 bg-sky-950/60" : "text-slate-400"
                          }`}
                        >
                          {adjMatrix.labels[rIdx]}
                        </td>
                        {row.map((val, cIdx) => {
                          const isHovered = hoveredCell?.row === rIdx && hoveredCell?.col === cIdx;
                          const hasEdge = Number(val) > 0;
                          return (
                            <td
                              key={cIdx}
                              onMouseEnter={() => handleCellHover(rIdx, cIdx)}
                              onMouseLeave={handleCellLeave}
                              onClick={() => handleCellClick(rIdx, cIdx)}
                              className={`p-2 border border-slate-800/80 cursor-pointer font-bold transition-all ${
                                isHovered
                                  ? "bg-sky-500 text-slate-950 scale-105 shadow-md"
                                  : hasEdge
                                  ? "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60"
                                  : "bg-slate-950/40 text-slate-600 hover:bg-slate-800/50"
                              }`}
                              title={`Edge (${adjMatrix.labels[rIdx]}, ${adjMatrix.labels[cIdx]}): ${
                                hasEdge ? `Weight ${val} (Click to remove)` : "None (Click to add)"
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Adjacency List View */}
          {activeRepTab === "adjList" && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ListFilter className="w-4 h-4 text-emerald-400" />
                  Adjacency List Structure
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Space: O(V + E) • Iteration: O(deg(v))
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                {adjList.map((entry) => (
                  <div
                    key={entry.vertexId}
                    onMouseEnter={() => store.setSelectedVertexId(entry.vertexId)}
                    onMouseLeave={() => store.setSelectedVertexId(null)}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition-colors flex items-center gap-3"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-500/30 min-w-[70px] text-center">
                      [{entry.vertexLabel}]
                    </span>
                    <span className="text-slate-600 font-bold">➔</span>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {entry.neighbors.length > 0 ? (
                        entry.neighbors.map((nb, nIdx) => (
                          <span
                            key={nIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200 text-[11px]"
                          >
                            {nb.targetLabel}
                            {nb.weight !== undefined && (
                              <span className="text-amber-400 ml-1">({nb.weight}km)</span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-600 text-[11px] italic">No outgoing neighbors (NIL)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edge List View */}
          {activeRepTab === "edgeList" && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Edge List Enumeration E = {"{(u, v, w)}"}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  |E| = {edgeList.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                {edgeList.map((edge, idx) => (
                  <div
                    key={edge.id}
                    onMouseEnter={() => {
                      store.setHighlightedEdges([edge.id]);
                      store.setHighlightedPath([edge.sourceId, edge.targetId]);
                    }}
                    onMouseLeave={() => {
                      store.setHighlightedEdges([]);
                      store.setHighlightedPath([]);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[10px]">#{idx + 1}</span>
                      <span className="text-sky-300 font-bold">{edge.sourceLabel}</span>
                      <span className="text-slate-600 font-bold">{edge.directed ? "➔" : "—"}</span>
                      <span className="text-emerald-300 font-bold">{edge.targetLabel}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {edge.weight !== undefined && (
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-bold border border-slate-800">
                          w = {edge.weight}
                        </span>
                      )}
                      <span className="text-slate-500 text-[10px] uppercase font-sans">
                        {edge.type || "edge"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incidence Matrix View */}
          {activeRepTab === "incidence" && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Columns className="w-4 h-4 text-amber-400" />
                  Incidence Matrix M (|V| × |E|)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Rows: Vertices • Cols: Edges
                </span>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="border-collapse text-center text-xs font-mono">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-800/80 bg-slate-950 text-slate-500 text-[10px]">
                        V \ E
                      </th>
                      {incidenceMatrix.edgeLabels.map((eLbl, idx) => (
                        <th
                          key={idx}
                          className="p-2 border border-slate-800/80 bg-slate-950 font-bold text-slate-400 min-w-[40px]"
                        >
                          {eLbl}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {incidenceMatrix.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-2 border border-slate-800/80 bg-slate-950 font-bold text-slate-300">
                          {incidenceMatrix.vertexLabels[rIdx]}
                        </td>
                        {row.map((val, cIdx) => (
                          <td
                            key={cIdx}
                            className={`p-2 border border-slate-800/80 font-bold ${
                              val === 1
                                ? "bg-sky-950/70 text-sky-300"
                                : val === -1
                                ? "bg-rose-950/70 text-rose-300"
                                : "bg-slate-950/30 text-slate-600"
                            }`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
