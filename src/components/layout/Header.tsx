import React, { useState } from "react";
import { useGraphStore } from "../../state/graphStore";
import { ALL_PRESET_GRAPHS } from "../../data/graphExamples";
import {
  Boxes,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Layers,
  Palette,
  Eye,
  Undo2,
  Redo2,
  Compass,
} from "lucide-react";

interface HeaderProps {
  onToggleSettings?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSettings, onToggleSidebar }) => {
  const store = useGraphStore();
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="h-16 px-4 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between z-30 sticky top-0 shadow-md">
      {/* Left: Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Layers className="w-5 h-5" />
        </button>

        <div
          onClick={() => store.setActiveTab("dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-rose-500 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Boxes className="w-5 h-5 text-sky-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-sky-400 via-indigo-200 to-pink-400 bg-clip-text text-transparent">
                GraphSphere 3D
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-400 border border-sky-500/30">
                PRO ENGINE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              Real-World Graph Theory, Comparative Analysis & 3D Interactive Topology
            </p>
          </div>
        </div>
      </div>

      {/* Center: Graph Preset Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl shadow-inner transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="max-w-[140px] sm:max-w-[180px] truncate text-slate-100">
            {store.activeGraph.name}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {presetDropdownOpen && (
          <div className="absolute right-0 sm:left-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
              Real-World Networks
            </div>
            {ALL_PRESET_GRAPHS.filter((g) => g.category && ["social", "campus", "web", "utility"].includes(g.category)).map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  store.loadPreset(g.id);
                  setPresetDropdownOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                  store.activeGraph.id === g.id ? "bg-sky-950/70 text-sky-300 font-semibold border-l-2 border-sky-400" : "text-slate-300"
                }`}
              >
                <span className="truncate">{g.name}</span>
                <span className="text-[10px] font-mono text-slate-500 ml-2">
                  |V|={g.vertices.length}
                </span>
              </button>
            ))}

            <div className="text-[11px] font-bold text-slate-400 px-2 py-1 mt-2 uppercase tracking-wider border-t border-slate-800">
              Mathematical Models
            </div>
            {ALL_PRESET_GRAPHS.filter((g) => !g.category || g.category === "math").map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  store.loadPreset(g.id);
                  setPresetDropdownOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                  store.activeGraph.id === g.id ? "bg-sky-950/70 text-sky-300 font-semibold border-l-2 border-sky-400" : "text-slate-300"
                }`}
              >
                <span className="truncate">{g.name}</span>
                <span className="text-[10px] font-mono text-slate-500 ml-2">
                  |V|={g.vertices.length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={store.undo}
          disabled={!store.canUndo}
          title="Undo"
          className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 disabled:hover:bg-transparent hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={store.redo}
          disabled={!store.canRedo}
          title="Redo"
          className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 disabled:hover:bg-transparent hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={store.triggerResetCamera}
          title="Reset Camera"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Visual Settings Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            title="Display & Visual Settings"
            className={`p-2 rounded-lg border transition-colors ${
              settingsOpen
                ? "bg-sky-950/80 text-sky-300 border-sky-500/50"
                : "text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 text-xs text-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-sky-400" />
                  3D View Settings
                </span>
                <span className="text-[10px] text-slate-500">Real-time</span>
              </div>

              {/* Toggle Switches */}
              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Labels</span>
                <input
                  type="checkbox"
                  checked={store.visualSettings.showLabels}
                  onChange={(e) => store.updateVisualSettings({ showLabels: e.target.checked })}
                  className="rounded bg-slate-800 text-sky-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Weights</span>
                <input
                  type="checkbox"
                  checked={store.visualSettings.showWeights}
                  onChange={(e) => store.updateVisualSettings({ showWeights: e.target.checked })}
                  className="rounded bg-slate-800 text-sky-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Directional Arrows</span>
                <input
                  type="checkbox"
                  checked={store.visualSettings.showArrows}
                  onChange={(e) => store.updateVisualSettings({ showArrows: e.target.checked })}
                  className="rounded bg-slate-800 text-sky-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Auto-Orbit 3D</span>
                <input
                  type="checkbox"
                  checked={store.visualSettings.autoRotate}
                  onChange={(e) => store.updateVisualSettings({ autoRotate: e.target.checked })}
                  className="rounded bg-slate-800 text-sky-500 focus:ring-0"
                />
              </label>

              {/* Color Mode Selector */}
              <div>
                <span className="block mb-1 text-slate-400">Node Coloring Mode</span>
                <select
                  value={store.visualSettings.colorMode}
                  onChange={(e) => store.updateVisualSettings({ colorMode: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="default">Default / Entity Type</option>
                  <option value="degree">Degree Heatmap</option>
                  <option value="bipartite">Bipartite Partition</option>
                </select>
              </div>

              {/* Node Size Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Node Scale</span>
                  <span>{store.visualSettings.nodeSize.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={store.visualSettings.nodeSize}
                  onChange={(e) => store.updateVisualSettings({ nodeSize: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
