import React, { useState, useEffect, useMemo, useRef } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { runBFS } from "../algorithms/bfs";
import { runDFS } from "../algorithms/dfs";
import { runDijkstra } from "../algorithms/dijkstra";
import { analyzeEuler } from "../algorithms/euler";
import { analyzeHamiltonian } from "../algorithms/hamiltonian";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  GitBranch,
  Network,
  Route,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const Algorithms: React.FC = () => {
  const { activeGraph } = useGraphStore();

  const [selectedAlgo, setSelectedAlgo] = useState<"bfs" | "dfs" | "dijkstra" | "euler" | "hamilton">("bfs");
  const [startNodeId, setStartNodeId] = useState<string>("");
  const [targetNodeId, setTargetNodeId] = useState<string>("");

  // Step playback state
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize start/target nodes when graph changes
  useEffect(() => {
    if (activeGraph.vertices.length > 0) {
      if (!activeGraph.vertices.some((v) => v.id === startNodeId)) {
        setStartNodeId(activeGraph.vertices[0].id);
      }
      if (!activeGraph.vertices.some((v) => v.id === targetNodeId)) {
        setTargetNodeId(activeGraph.vertices[activeGraph.vertices.length - 1].id);
      }
    }
  }, [activeGraph]);

  // Compute algorithm results
  const bfsResult = useMemo(() => {
    if (!startNodeId) return null;
    return runBFS(activeGraph, startNodeId);
  }, [activeGraph, startNodeId]);

  const dfsResult = useMemo(() => {
    if (!startNodeId) return null;
    return runDFS(activeGraph, startNodeId);
  }, [activeGraph, startNodeId]);

  const dijkstraResult = useMemo(() => {
    if (!startNodeId || !targetNodeId) return null;
    return runDijkstra(activeGraph, startNodeId, targetNodeId);
  }, [activeGraph, startNodeId, targetNodeId]);

  const eulerResult = useMemo(() => {
    return analyzeEuler(activeGraph);
  }, [activeGraph]);

  const hamiltonResult = useMemo(() => {
    return analyzeHamiltonian(activeGraph, 14);
  }, [activeGraph]);

  // Get active steps count and current step object
  const stepsCount = useMemo(() => {
    if (selectedAlgo === "bfs") return bfsResult?.steps.length ?? 0;
    if (selectedAlgo === "dfs") return dfsResult?.steps.length ?? 0;
    if (selectedAlgo === "dijkstra") return dijkstraResult?.steps.length ?? 0;
    if (selectedAlgo === "euler") return Math.max(1, eulerResult.edgeSequence.length);
    if (selectedAlgo === "hamilton") return Math.max(1, (hamiltonResult.circuitVertices.length || hamiltonResult.pathVertices.length));
    return 1;
  }, [selectedAlgo, bfsResult, dfsResult, dijkstraResult, eulerResult, hamiltonResult]);

  // Auto playback
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setTimeout(() => {
        if (currentStepIdx < stepsCount - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIdx, stepsCount]);

  // Reset step index if algorithm or nodes change
  const handleAlgoChange = (algo: typeof selectedAlgo) => {
    setSelectedAlgo(algo);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStepIdx((prev) => Math.min(stepsCount - 1, prev + 1));
  };

  const handlePlayPause = () => {
    if (currentStepIdx >= stepsCount - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Derive active highlights
  const { highlightVertexIds, highlightEdgeIds, visitedVertexIds, stepDescription } = useMemo(() => {
    if (selectedAlgo === "bfs" && bfsResult) {
      const step = bfsResult.steps[currentStepIdx] || bfsResult.steps[0];
      return {
        highlightVertexIds: step ? (step.currentVertex ? [step.currentVertex] : []) : [],
        highlightEdgeIds: step ? step.activeEdges : [],
        visitedVertexIds: step ? step.visitedVertices : [],
        stepDescription: step ? step.description : "",
      };
    }
    if (selectedAlgo === "dfs" && dfsResult) {
      const step = dfsResult.steps[currentStepIdx] || dfsResult.steps[0];
      return {
        highlightVertexIds: step ? (step.currentVertex ? [step.currentVertex] : []) : [],
        highlightEdgeIds: step ? step.activeEdges : [],
        visitedVertexIds: step ? step.visitedVertices : [],
        stepDescription: step ? step.description : "",
      };
    }
    if (selectedAlgo === "dijkstra" && dijkstraResult) {
      const step = dijkstraResult.steps[currentStepIdx] || dijkstraResult.steps[0];
      const isLast = currentStepIdx === dijkstraResult.steps.length - 1;
      return {
        highlightVertexIds: isLast && dijkstraResult.isReachable ? dijkstraResult.path : (step?.currentVertex ? [step.currentVertex] : []),
        highlightEdgeIds: isLast && dijkstraResult.isReachable ? dijkstraResult.pathEdgeIds : (step ? step.highlightEdges : []),
        visitedVertexIds: step ? step.visited : [],
        stepDescription: step ? step.description : "",
      };
    }
    if (selectedAlgo === "euler") {
      if (eulerResult.hasEulerPath || eulerResult.hasEulerCircuit) {
        const edgeSubset = eulerResult.edgeSequence.slice(0, currentStepIdx + 1);
        const vertexSubset = eulerResult.sequence.slice(0, currentStepIdx + 2);
        return {
          highlightVertexIds: vertexSubset,
          highlightEdgeIds: edgeSubset,
          visitedVertexIds: vertexSubset,
          stepDescription: `Traversing edge ${currentStepIdx + 1} of ${eulerResult.edgeSequence.length}: ${eulerResult.message}`,
        };
      }
      return {
        highlightVertexIds: [],
        highlightEdgeIds: [],
        visitedVertexIds: [],
        stepDescription: eulerResult.message,
      };
    }
    if (selectedAlgo === "hamilton") {
      const seq = hamiltonResult.circuitVertices.length > 0 ? hamiltonResult.circuitVertices : hamiltonResult.pathVertices;
      const edges = hamiltonResult.circuitEdges.length > 0 ? hamiltonResult.circuitEdges : hamiltonResult.pathEdges;
      if (seq.length > 0) {
        const vSubset = seq.slice(0, currentStepIdx + 1);
        const eSubset = edges.slice(0, currentStepIdx);
        return {
          highlightVertexIds: vSubset,
          highlightEdgeIds: eSubset,
          visitedVertexIds: vSubset,
          stepDescription: `Visiting vertex ${currentStepIdx + 1} of ${seq.length}: ${hamiltonResult.message}`,
        };
      }
      return {
        highlightVertexIds: [],
        highlightEdgeIds: [],
        visitedVertexIds: [],
        stepDescription: hamiltonResult.message,
      };
    }

    return { highlightVertexIds: [], highlightEdgeIds: [], visitedVertexIds: [], stepDescription: "" };
  }, [selectedAlgo, currentStepIdx, bfsResult, dfsResult, dijkstraResult, eulerResult, hamiltonResult]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0B1220] to-[#111827] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/20">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Algorithm Visualizer</span>
          </div>
          <h1 className="text-2xl font-black text-[#F8FAFC]">
            Graph Algorithms & Traversals
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl">
            Step through BFS, DFS, Dijkstra shortest path, Eulerian edge traversals, and
            Hamiltonian vertex cycles with animated state playback.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1220] border border-[#1E293B] flex-wrap">
          {(["bfs", "dfs", "dijkstra", "euler", "hamilton"] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => handleAlgoChange(algo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedAlgo === algo
                  ? "bg-[#38BDF8] text-[#050816]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {algo === "hamilton" ? "Hamilton" : algo}
            </button>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        {/* Source / Target Selectors for BFS/DFS/Dijkstra */}
        <div className="flex items-center gap-4 flex-wrap">
          {(selectedAlgo === "bfs" || selectedAlgo === "dfs" || selectedAlgo === "dijkstra") && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#22C55E]">Start Node:</span>
              <select
                value={startNodeId}
                onChange={(e) => {
                  setStartNodeId(e.target.value);
                  setCurrentStepIdx(0);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none"
              >
                {activeGraph.vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedAlgo === "dijkstra" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#F59E0B]">Target Node:</span>
              <select
                value={targetNodeId}
                onChange={(e) => {
                  setTargetNodeId(e.target.value);
                  setCurrentStepIdx(0);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none"
              >
                {activeGraph.vertices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset to step 0"
            className="p-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] disabled:opacity-40 text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B] transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            className="px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-[#050816] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx >= stepsCount - 1}
            className="p-2 rounded-lg bg-[#0B1220] hover:bg-[#1E293B] disabled:opacity-40 text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B] transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <span className="text-xs text-[#64748B] ml-2 font-mono">
            Step {currentStepIdx + 1} / {Math.max(1, stepsCount)}
          </span>
        </div>
      </div>

      {/* 3D Scene + Step Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-3">
          <GraphCanvas3D
            graph={activeGraph}
            highlightVertexIds={highlightVertexIds}
            highlightEdgeIds={highlightEdgeIds}
            visitedVertexIds={visitedVertexIds}
            height="h-[520px]"
          />

          {/* Step description */}
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] flex items-center gap-3">
            <Route className="w-5 h-5 text-[#22D3EE] flex-shrink-0" />
            <div className="text-xs text-[#F8FAFC]">
              <span className="font-bold text-[#22D3EE] mr-2">Step Status:</span>
              {stepDescription}
            </div>
          </div>
        </div>

        {/* Algorithm Theory & Output Panel */}
        <div className="lg:col-span-4 space-y-4">
          {selectedAlgo === "bfs" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
              <span className="text-xs font-bold text-[#F8FAFC] block">
                Breadth-First Search (BFS)
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Level-order exploration using a FIFO Queue. Explores all neighbors at distance d
                before expanding to distance d+1.
              </p>
              <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs space-y-1 font-mono">
                <span className="text-[#64748B] block text-[10px] uppercase font-sans">Visit Order:</span>
                <span className="text-[#38BDF8]">{bfsResult?.visitOrderLabels.join(" → ") || "—"}</span>
              </div>
            </div>
          )}

          {selectedAlgo === "dfs" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
              <span className="text-xs font-bold text-[#F8FAFC] block">
                Depth-First Search (DFS)
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Deep branch exploration using a LIFO Stack or recursion. Explores as far as possible
                along each branch before backtracking.
              </p>
              <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs space-y-1 font-mono">
                <span className="text-[#64748B] block text-[10px] uppercase font-sans">Visit Order:</span>
                <span className="text-[#818CF8]">{dfsResult?.visitOrderLabels.join(" → ") || "—"}</span>
              </div>
            </div>
          )}

          {selectedAlgo === "euler" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
              <span className="text-xs font-bold text-[#F8FAFC] block">
                Eulerian Traversal (Hierholzer)
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Traverses every edge in the graph exactly once.
              </p>
              <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Euler Circuit:</span>
                  <span className={eulerResult.hasEulerCircuit ? "text-[#22C55E] font-bold" : "text-[#64748B]"}>
                    {eulerResult.hasEulerCircuit ? "Yes (0 odd degs)" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Euler Path:</span>
                  <span className={eulerResult.hasEulerPath ? "text-[#22C55E] font-bold" : "text-[#EF4444] font-bold"}>
                    {eulerResult.hasEulerPath ? "Yes (2 odd degs)" : "No"}
                  </span>
                </div>
                {eulerResult.sequenceLabels.length > 0 && (
                  <div className="pt-2 border-t border-[#1E293B] font-mono text-[#38BDF8] text-[11px] break-words">
                    {eulerResult.sequenceLabels.join(" → ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedAlgo === "hamilton" && (
            <div className="p-5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-3">
              <span className="text-xs font-bold text-[#F8FAFC] block">
                Hamiltonian Traversal (NP-Complete)
              </span>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Visits every vertex in the graph exactly once. Determined via backtracking with
                graph size safeguard limit (|V| ≤ 16).
              </p>
              <div className="p-3 rounded-lg bg-[#0B1220] border border-[#1E293B] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Hamilton Circuit:</span>
                  <span className={hamiltonResult.hasHamiltonCircuit ? "text-[#22C55E] font-bold" : "text-[#64748B]"}>
                    {hamiltonResult.hasHamiltonCircuit ? "Yes ✓" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Hamilton Path:</span>
                  <span className={hamiltonResult.hasHamiltonPath ? "text-[#22C55E] font-bold" : "text-[#EF4444] font-bold"}>
                    {hamiltonResult.hasHamiltonPath ? "Yes ✓" : "No"}
                  </span>
                </div>
                {hamiltonResult.pathLabels.length > 0 && (
                  <div className="pt-2 border-t border-[#1E293B] font-mono text-[#22C55E] text-[11px] break-words">
                    {hamiltonResult.pathLabels.join(" → ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
