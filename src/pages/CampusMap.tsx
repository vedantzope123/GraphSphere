import React, { useState, useEffect, useMemo, useRef } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { CAMPUS_GRAPH } from "../data/campusGraph";
import { runDijkstra } from "../algorithms/dijkstra";
import {
  MapPin,
  Navigation,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Route,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const CampusMap: React.FC = () => {
  const store = useGraphStore();

  const [sourceId, setSourceId] = useState<string>("c_college");
  const [targetId, setTargetId] = useState<string>("c_ground");

  // Step-by-step playback
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute Dijkstra result
  const dijkstraResult = useMemo(() => {
    return runDijkstra(CAMPUS_GRAPH, sourceId, targetId);
  }, [sourceId, targetId]);

  const totalSteps = dijkstraResult.steps.length;
  const currentStep = dijkstraResult.steps[currentStepIndex] || dijkstraResult.steps[0];

  const { setHighlightedPath, setHighlightedEdges } = store;

  // Sync highlights with 3D canvas
  useEffect(() => {
    if (!currentStep) return;

    if (currentStepIndex === totalSteps - 1) {
      // Completed - highlight final shortest path
      setHighlightedPath(dijkstraResult.path);

      // Find edge IDs for shortest path
      const pathEdgeIds: string[] = [];
      for (let i = 0; i < dijkstraResult.path.length - 1; i++) {
        const u = dijkstraResult.path[i];
        const v = dijkstraResult.path[i + 1];
        const found = CAMPUS_GRAPH.edges.find(
          (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
        );
        if (found) pathEdgeIds.push(found.id);
      }
      setHighlightedEdges(pathEdgeIds);
    } else {
      // During playback: highlight visited set + current vertex
      const activePath = [...currentStep.visited];
      if (currentStep.currentVertex && !activePath.includes(currentStep.currentVertex)) {
        activePath.push(currentStep.currentVertex);
      }
      setHighlightedPath(activePath);
      setHighlightedEdges(currentStep.highlightEdges || []);
    }
  }, [currentStepIndex, totalSteps, dijkstraResult, setHighlightedPath, setHighlightedEdges]);

  // Autoplay loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((c) => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((c) => c - 1);
    }
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    setCurrentStepIndex(totalSteps - 1);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-400">
            <Navigation className="w-4 h-4" />
            WEIGHTED ROAD NETWORK & DIJKSTRA NAVIGATION
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Campus Wayfinding & Shortest Route Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Edges represent physical campus paths with edge weights denoting real distance in kilometers.
            Dijkstra's Greedy Algorithm discovers the globally optimal route by maintaining a priority queue
            of shortest tentative distances.
          </p>
        </div>

        {/* Source & Target Dropdowns */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono">FROM:</span>
            <select
              value={sourceId}
              onChange={(e) => {
                setSourceId(e.target.value);
                handleReset();
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-emerald-400 font-semibold focus:outline-none focus:border-emerald-500"
            >
              {CAMPUS_GRAPH.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-600">➔</span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono">TO:</span>
            <select
              value={targetId}
              onChange={(e) => {
                setTargetId(e.target.value);
                handleReset();
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-sky-400 font-semibold focus:outline-none focus:border-sky-500"
            >
              {CAMPUS_GRAPH.vertices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Canvas + Dijkstra Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D
              graph={CAMPUS_GRAPH}
              titleBadge={`Campus Network (${CAMPUS_GRAPH.vertices.length} Locations, ${CAMPUS_GRAPH.edges.length} Roads)`}
              onVertexClick={(v) => {
                if (v.id !== sourceId) setTargetId(v.id);
              }}
            />
          </div>

          {/* Playback Controls Bar */}
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
                disabled={currentStepIndex === 0}
                className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "Pause" : "Play Run"}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIndex === totalSteps - 1}
                className="p-2 text-slate-300 hover:text-white disabled:text-slate-600 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleJumpToEnd}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Fast-Forward
              </button>
            </div>

            {/* Step Counter & Speed */}
            <div className="flex items-center gap-4 text-xs">
              <div className="text-slate-300 font-mono">
                Step <span className="font-bold text-emerald-400">{currentStepIndex + 1}</span> of{" "}
                <span className="text-slate-400">{totalSteps}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
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

          {/* Live Step Explanation Callout */}
          {currentStep && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-100 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300">Algorithm State: </span>
                {currentStep.description}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Shortest Path Result & Distance Table */}
        <div className="space-y-4">
          {/* Final Route Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Route className="w-4 h-4 text-emerald-400" />
                Shortest Route Result
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                {dijkstraResult.totalDistance.toFixed(1)} km Total
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">Optimal Path Sequence:</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {dijkstraResult.pathLabels.map((label, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950 border border-emerald-500/40 text-emerald-300">
                      {label}
                    </span>
                    {idx < dijkstraResult.pathLabels.length - 1 && (
                      <span className="text-slate-600 font-bold">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Total Nodes Visited:</span>
                <span className="font-mono text-slate-200 font-semibold">{dijkstraResult.visitedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Reachable?</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {dijkstraResult.isReachable ? "Yes (Finite Cost)" : "No (Disconnected)"}
                </span>
              </div>
            </div>
          </div>

          {/* Live Dijkstra Distance Table */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col h-[340px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Tentative Distances d[v]</span>
              <span className="text-[10px] font-mono text-slate-500">Step {currentStepIndex + 1}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {CAMPUS_GRAPH.vertices.map((v) => {
                const dist = currentStep ? currentStep.distances[v.id] : undefined;
                const isVisited = currentStep?.visited.includes(v.id);
                const isCurrent = currentStep?.currentVertex === v.id;
                const isSource = v.id === sourceId;
                const isTarget = v.id === targetId;

                return (
                  <div
                    key={v.id}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isCurrent
                        ? "bg-emerald-950/80 border border-emerald-500/50 text-white"
                        : isVisited
                        ? "bg-slate-950/80 text-slate-300 border border-slate-850"
                        : "hover:bg-slate-800/60 text-slate-400 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isVisited ? "bg-emerald-400" : isCurrent ? "bg-amber-400 animate-ping" : "bg-slate-700"
                        }`}
                      />
                      <div>
                        <span className="font-semibold text-slate-200">{v.label}</span>
                        {isSource && <span className="ml-1 text-[9px] text-emerald-400 font-mono">(SRC)</span>}
                        {isTarget && <span className="ml-1 text-[9px] text-sky-400 font-mono">(DST)</span>}
                      </div>
                    </div>

                    <div className="font-mono text-right">
                      <span
                        className={`font-bold ${
                          dist === Infinity
                            ? "text-slate-600"
                            : isVisited
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {dist === Infinity ? "∞" : `${dist?.toFixed(1)} km`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
