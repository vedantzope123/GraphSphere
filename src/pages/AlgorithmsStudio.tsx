import React, { useState, useEffect, useMemo, useRef } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { runBFS } from "../algorithms/bfs";
import { runDFS } from "../algorithms/dfs";
import { runDijkstra } from "../algorithms/dijkstra";
import { analyzeEuler } from "../algorithms/euler";
import { analyzeHamiltonian } from "../algorithms/hamiltonian";
import {
  Cpu,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  ListTree,
} from "lucide-react";

export const AlgorithmsStudio: React.FC = () => {
  const store = useGraphStore();

  const { setHighlightedPath, setHighlightedEdges } = store;
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"bfs" | "dfs" | "dijkstra" | "euler" | "hamilton">("bfs");
  const [startVertexId, setStartVertexId] = useState<string>(
    store.activeGraph.vertices[0]?.id || ""
  );
  const [targetVertexId, setTargetVertexId] = useState<string>(
    store.activeGraph.vertices[store.activeGraph.vertices.length - 1]?.id || ""
  );

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback if vertices change
  useEffect(() => {
    if (store.activeGraph.vertices.length > 0) {
      if (!store.activeGraph.vertices.some((v) => v.id === startVertexId)) {
        setStartVertexId(store.activeGraph.vertices[0].id);
      }
      if (!store.activeGraph.vertices.some((v) => v.id === targetVertexId)) {
        setTargetVertexId(store.activeGraph.vertices[store.activeGraph.vertices.length - 1].id);
      }
    }
  }, [store.activeGraph.vertices, startVertexId, targetVertexId]);

  // Compute steps based on selected algorithm
  const algorithmResult = useMemo(() => {
    if (store.activeGraph.vertices.length === 0) {
      return { steps: [], summary: "Empty Graph" };
    }

    if (selectedAlgorithm === "bfs") {
      const bfs = runBFS(store.activeGraph, startVertexId);
      return {
        steps: bfs.steps,
        visitOrder: bfs.visitOrderLabels,
        summary: `BFS Traversal visited ${bfs.visitOrder.length} vertices in breadth-first level order.`,
      };
    }

    if (selectedAlgorithm === "dfs") {
      const dfs = runDFS(store.activeGraph, startVertexId);
      return {
        steps: dfs.steps,
        visitOrder: dfs.visitOrderLabels,
        summary: `DFS Traversal explored ${dfs.visitOrder.length} vertices using depth backtracking.`,
      };
    }

    if (selectedAlgorithm === "dijkstra") {
      const dij = runDijkstra(store.activeGraph, startVertexId, targetVertexId);
      return {
        steps: dij.steps.map((s, idx) => ({
          stepIndex: idx,
          currentVertex: s.currentVertex,
          visitedVertices: s.visited,
          activeEdges: s.highlightEdges,
          description: s.description,
          queueOrStack: Object.entries(s.distances).map(
            ([k, v]) => `${store.activeGraph.vertices.find((x) => x.id === k)?.label || k}: ${v === Infinity ? "∞" : v}`
          ),
        })),
        visitOrder: dij.pathLabels,
        totalDistance: dij.totalDistance,
        summary: dij.isReachable
          ? `Shortest Path: ${dij.pathLabels.join(" ➔ ")} (Distance: ${dij.totalDistance})`
          : "Target is unreachable from source.",
      };
    }

    if (selectedAlgorithm === "euler") {
      const eul = analyzeEuler(store.activeGraph);
      const steps = eul.sequence.map((vId, idx) => ({
        stepIndex: idx,
        currentVertex: vId,
        visitedVertices: eul.sequence.slice(0, idx + 1),
        activeEdges: eul.edgeSequence.slice(0, idx),
        description: `Traversing Euler walk step ${idx + 1}: visited ${eul.sequenceLabels[idx]}`,
        queueOrStack: [`Walk length: ${idx + 1} / ${eul.sequence.length}`],
      }));
      return {
        steps,
        visitOrder: eul.sequenceLabels,
        summary: eul.message,
      };
    }

    if (selectedAlgorithm === "hamilton") {
      const ham = analyzeHamiltonian(store.activeGraph, 14);
      const steps = ham.pathVertices.map((vId, idx) => ({
        stepIndex: idx,
        currentVertex: vId,
        visitedVertices: ham.pathVertices.slice(0, idx + 1),
        activeEdges: [],
        description: `Hamiltonian step ${idx + 1}: Visiting vertex ${ham.pathLabels[idx]}`,
        queueOrStack: [`Visited ${idx + 1} of ${store.activeGraph.vertices.length} vertices exactly once`],
      }));
      return {
        steps,
        visitOrder: ham.pathLabels,
        summary: ham.message,
      };
    }

    return { steps: [], summary: "" };
  }, [selectedAlgorithm, store.activeGraph, startVertexId, targetVertexId]);

  const totalSteps = algorithmResult.steps.length;
  const currentStep = algorithmResult.steps[stepIndex] || algorithmResult.steps[0];

  // Sync highlights with 3D canvas
  useEffect(() => {
    if (!currentStep) return;
    setHighlightedPath(currentStep.visitedVertices || []);
    setHighlightedEdges(currentStep.activeEdges || []);
  }, [stepIndex, currentStep, setHighlightedPath, setHighlightedEdges]);

  // Autoplay loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (stepIndex < totalSteps - 1) {
          setStepIndex((c) => c + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, stepIndex, totalSteps, playbackSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const handleNext = () => {
    if (stepIndex < totalSteps - 1) setStepIndex((c) => c + 1);
  };

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex((c) => c - 1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-400">
            <Cpu className="w-4 h-4" />
            STEP-BY-STEP ALGORITHM VISUALIZATION STUDIO
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Graph Traversal & Optimization Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Step through classical graph theory algorithms. Inspect queue/stack buffer memory, active frontier
            nodes, and traversal discovery trees in real-time.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl flex-wrap">
          {(["bfs", "dfs", "dijkstra", "euler", "hamilton"] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => {
                setSelectedAlgorithm(algo);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedAlgorithm === algo
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {algo === "bfs" ? "BFS (Queue)" : algo === "dfs" ? "DFS (Stack)" : algo}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">START VERTEX:</span>
            <select
              value={startVertexId}
              onChange={(e) => {
                setStartVertexId(e.target.value);
                handleReset();
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-sky-300 font-semibold focus:outline-none focus:border-sky-500"
            >
              {store.activeGraph.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {selectedAlgorithm === "dijkstra" && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">TARGET:</span>
              <select
                value={targetVertexId}
                onChange={(e) => {
                  setTargetVertexId(e.target.value);
                  handleReset();
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
              >
                {store.activeGraph.vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Algorithm: <span className="text-white font-bold uppercase">{selectedAlgorithm}</span>
        </div>
      </div>

      {/* Main Grid: 3D Canvas + Queue/Stack State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D titleBadge={`${selectedAlgorithm.toUpperCase()} Playback`} />
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Reset to Step 0"
                className="p-2 text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrev}
                disabled={stepIndex === 0}
                className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "Pause" : "Play Run"}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={stepIndex >= totalSteps - 1}
                className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-slate-300 font-mono">
                Step <span className="font-bold text-indigo-400">{stepIndex + 1}</span> of{" "}
                <span className="text-slate-400">{totalSteps || 1}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-slate-200 text-xs focus:outline-none"
                >
                  <option value={1500}>0.7x (Slow)</option>
                  <option value={1000}>1.0x (Normal)</option>
                  <option value={500}>2.0x (Fast)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Step Description Callout */}
          {currentStep && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-100 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-300">Action: </span>
                {currentStep.description}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Data Structure HUD & Summary */}
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <ListTree className="w-4 h-4 text-indigo-400" />
              Algorithm Verdict & Outcome
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{algorithmResult.summary}</p>
          </div>

          {/* Memory Buffer / Queue / Stack Inspection */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col h-[380px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">
                {selectedAlgorithm === "bfs"
                  ? "FIFO Queue State"
                  : selectedAlgorithm === "dfs"
                  ? "LIFO Stack State"
                  : selectedAlgorithm === "dijkstra"
                  ? "Priority Distances"
                  : "Walk Buffer"}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Step {stepIndex + 1}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
              {currentStep?.queueOrStack && currentStep.queueOrStack.length > 0 ? (
                currentStep.queueOrStack.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-slate-300"
                  >
                    <span className="text-slate-500 text-[10px]">[{idx}]</span>
                    <span className="text-sky-300 font-bold">{item}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-600 italic text-xs">
                  Buffer empty or walk finished
                </div>
              )}
            </div>

            {/* Visit Order Sequence */}
            {algorithmResult.visitOrder && (
              <div className="mt-3 pt-2 border-t border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">
                  Cumulative Visit Sequence:
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[11px] text-emerald-400">
                  {algorithmResult.visitOrder.join(" ➔ ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
