import React, { useState } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { verifyHandshakingLemma } from "../utils/degreeUtils";
import { VertexType, EdgeType } from "../types/graph";
import {
  Wrench,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Undo2,
  Redo2,
  Sparkles,
  Link2,
  Check,
  Copy,
} from "lucide-react";

export const GraphBuilder: React.FC = () => {
  const store = useGraphStore();

  // Add Vertex State
  const [newVertexLabel, setNewVertexLabel] = useState("");
  const [newVertexType, setNewVertexType] = useState<VertexType>("custom");
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [posZ, setPosZ] = useState(0);

  // Add Edge State
  const [edgeSource, setEdgeSource] = useState("");
  const [edgeTarget, setEdgeTarget] = useState("");
  const [edgeDirected, setEdgeDirected] = useState(false);
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [edgeType, setEdgeType] = useState<EdgeType>("custom");

  // Export / Import State
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [copied, setCopied] = useState(false);

  const handshaking = verifyHandshakingLemma(store.activeGraph);

  const handleAddVertexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newVertexLabel.trim() || `V${store.activeGraph.vertices.length + 1}`;
    store.addVertex({
      label,
      type: newVertexType,
      position: [posX, posY, posZ],
    });
    setNewVertexLabel("");
    // Spread coordinates slightly for next node
    setPosX((x) => Number((x + (Math.random() * 4 - 2)).toFixed(1)));
    setPosY((y) => Number((y + (Math.random() * 3 - 1.5)).toFixed(1)));
  };

  const handleAddEdgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeSource || !edgeTarget || edgeSource === edgeTarget) return;

    // Check if edge already exists
    const exists = store.activeGraph.edges.some(
      (ed) =>
        (ed.source === edgeSource && ed.target === edgeTarget) ||
        (!edgeDirected && ed.source === edgeTarget && ed.target === edgeSource)
    );
    if (exists) return;

    store.addEdge({
      source: edgeSource,
      target: edgeTarget,
      directed: edgeDirected,
      weight: edgeWeight,
      type: edgeType,
      label: edgeWeight > 0 ? `${edgeWeight}` : undefined,
    });
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(store.activeGraph, null, 2);
    setJsonText(dataStr);
    setJsonModalOpen(true);
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed.vertices && parsed.edges) {
        store.setActiveGraph(parsed);
        setJsonModalOpen(false);
      }
    } catch (err) {
      alert("Invalid Graph JSON format.");
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-400">
            <Wrench className="w-4 h-4" />
            3D GRAPH ARCHITECT & TOPOLOGY SCULPTOR
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Interactive 3D Graph Builder</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Construct custom graph topologies from scratch or sculpt existing networks. Drag vertices
            directly in 3D viewport, add weighted/directed links, and monitor the live Handshaking Lemma equation.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={store.undo}
            disabled={!store.canUndo}
            title="Undo"
            className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={store.redo}
            disabled={!store.canRedo}
            title="Redo"
            className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>JSON I/O</span>
          </button>

          <button
            onClick={store.clearGraph}
            className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Graph</span>
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Canvas Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D titleBadge="3D Sculptor Mode (Drag to position nodes)" />
          </div>

          {/* Live Handshaking Lemma Monitor */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold font-mono text-sm">
                Σ
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Handshaking Lemma Invariant:</span>
                  <span className="text-emerald-400 font-mono">
                    {handshaking.isSatisfied ? "Holds (Valid Graph)" : "Violated"}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {handshaking.equation}
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <div>|V| = {store.activeGraph.vertices.length}</div>
              <div>|E| = {store.activeGraph.edges.length}</div>
            </div>
          </div>
        </div>

        {/* Builder Sidebar: Add Node & Add Edge Forms */}
        <div className="space-y-4">
          {/* Add Vertex Form */}
          <form
            onSubmit={handleAddVertexSubmit}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-400" />
                Add New Vertex
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                #{store.activeGraph.vertices.length + 1}
              </span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Vertex Label</label>
              <input
                type="text"
                placeholder="e.g. Server Alpha, Node D, User 16"
                value={newVertexLabel}
                onChange={(e) => setNewVertexLabel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Entity Type</label>
                <select
                  value={newVertexType}
                  onChange={(e) => setNewVertexType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="custom">General Node</option>
                  <option value="user">User / Person</option>
                  <option value="location">Campus Location</option>
                  <option value="website">Webpage / URL</option>
                  <option value="house">House</option>
                  <option value="utility">Utility</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Init Pos (X, Y, Z)</label>
                <div className="grid grid-cols-3 gap-1">
                  <input
                    type="number"
                    value={posX}
                    onChange={(e) => setPosX(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-center font-mono text-[11px] text-slate-200"
                  />
                  <input
                    type="number"
                    value={posY}
                    onChange={(e) => setPosY(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-center font-mono text-[11px] text-slate-200"
                  />
                  <input
                    type="number"
                    value={posZ}
                    onChange={(e) => setPosZ(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-1 text-center font-mono text-[11px] text-slate-200"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Spawn Vertex in 3D</span>
            </button>
          </form>

          {/* Add Edge Form */}
          <form
            onSubmit={handleAddEdgeSubmit}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-emerald-400" />
                Connect Edge
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {store.activeGraph.edges.length} total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Source Node</label>
                <select
                  value={edgeSource}
                  onChange={(e) => setEdgeSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-sky-400 font-semibold focus:outline-none focus:border-sky-500"
                >
                  <option value="">Select source...</option>
                  {store.activeGraph.vertices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Target Node</label>
                <select
                  value={edgeTarget}
                  onChange={(e) => setEdgeTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select target...</option>
                  {store.activeGraph.vertices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Edge Weight</label>
                <input
                  type="number"
                  step="0.5"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={edgeDirected}
                    onChange={(e) => setEdgeDirected(e.target.checked)}
                    className="rounded bg-slate-800 text-sky-500 focus:ring-0"
                  />
                  <span>Directed (➔)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!edgeSource || !edgeTarget || edgeSource === edgeTarget}
              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Establish Connection</span>
            </button>
          </form>
        </div>
      </div>

      {/* JSON Import/Export Modal */}
      {jsonModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-sm">Graph JSON Import / Export</span>
              <button
                onClick={() => setJsonModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={12}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={handleCopyJSON}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy JSON"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setJsonModalOpen(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportJSON}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                >
                  Load into Graph
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
