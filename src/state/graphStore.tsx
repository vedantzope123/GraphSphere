import { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { Graph, Vertex, Edge } from "../types/graph";
import {
  DEFAULT_STARTER_GRAPH,
  ALL_PRESET_GRAPHS,
  GRAPH_ISO_A,
  GRAPH_ISO_B,
} from "../data/graphExamples";
import { SOCIAL_GRAPH_A, SOCIAL_GRAPH_B } from "../data/socialGraphs";
import { CAMPUS_GRAPH } from "../data/campusGraph";
import { WEB_GRAPH } from "../data/webGraph";
import { UTILITY_GRAPH } from "../data/utilityGraph";
import { cloneGraph } from "../utils/graphUtils";

export type NavTab =
  | "dashboard"
  | "social"
  | "web"
  | "campus"
  | "utility"
  | "comparison"
  | "builder"
  | "matrix"
  | "algorithms"
  | "coloring"
  | "challenges"
  | "presentation"
  | "theory";

export interface VisualSettings {
  showLabels: boolean;
  showWeights: boolean;
  showArrows: boolean;
  nodeSize: number;
  edgeThickness: number;
  autoRotate: boolean;
  colorMode: "type" | "degree" | "component" | "bipartite" | "default";
  glowEffect: boolean;
  gridFloor: boolean;
}

export interface GraphStoreState {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeGraph: Graph;
  setActiveGraph: (graph: Graph | ((prev: Graph) => Graph)) => void;
  loadPreset: (id: string) => void;
  comparisonGraphA: Graph;
  comparisonGraphB: Graph;
  setComparisonGraphA: (graph: Graph) => void;
  setComparisonGraphB: (graph: Graph) => void;
  selectedVertexId: string | null;
  setSelectedVertexId: (id: string | null) => void;
  selectedEdgeId: string | null;
  setSelectedEdgeId: (id: string | null) => void;
  hoveredVertexId: string | null;
  setHoveredVertexId: (id: string | null) => void;
  highlightedPath: string[];
  setHighlightedPath: (path: string[]) => void;
  highlightedEdges: string[];
  setHighlightedEdges: (edges: string[]) => void;
  visualSettings: VisualSettings;
  updateVisualSettings: (settings: Partial<VisualSettings>) => void;
  resetCameraCounter: number;
  triggerResetCamera: () => void;
  // Undo / Redo for active graph
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  // Vertex and Edge editing shortcuts
  addVertex: (vertex: Omit<Vertex, "id"> & { id?: string }) => void;
  updateVertex: (id: string, updates: Partial<Vertex>) => void;
  removeVertex: (id: string) => void;
  addEdge: (edge: Omit<Edge, "id"> & { id?: string }) => void;
  removeEdge: (id: string) => void;
  clearGraph: () => void;
}

const GraphContext = createContext<GraphStoreState | null>(null);

export function useGraphStore(): GraphStoreState {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphStore must be used within GraphProvider");
  }
  return context;
}

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<NavTab>("dashboard");
  const [activeGraph, setActiveGraphState] = useState<Graph>(() => cloneGraph(DEFAULT_STARTER_GRAPH));
  const [history, setHistory] = useState<Graph[]>([cloneGraph(DEFAULT_STARTER_GRAPH)]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [comparisonGraphA, setComparisonGraphA] = useState<Graph>(() => cloneGraph(SOCIAL_GRAPH_A));
  const [comparisonGraphB, setComparisonGraphB] = useState<Graph>(() => cloneGraph(SOCIAL_GRAPH_B));

  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [hoveredVertexId, setHoveredVertexId] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [highlightedEdges, setHighlightedEdges] = useState<string[]>([]);

  const [resetCameraCounter, setResetCameraCounter] = useState(0);

  const [visualSettings, setVisualSettings] = useState<VisualSettings>({
    showLabels: true,
    showWeights: true,
    showArrows: true,
    nodeSize: 1.0,
    edgeThickness: 1.0,
    autoRotate: false,
    colorMode: "default",
    glowEffect: true,
    gridFloor: true,
  });

  const triggerResetCamera = useCallback(() => {
    setResetCameraCounter((c) => c + 1);
  }, []);

  const updateVisualSettings = useCallback((newSettings: Partial<VisualSettings>) => {
    setVisualSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const setActiveGraph = useCallback(
    (action: Graph | ((prev: Graph) => Graph)) => {
      setActiveGraphState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        setHistory((oldHist) => {
          const trimmed = oldHist.slice(0, historyIndex + 1);
          return [...trimmed, cloneGraph(next)];
        });
        setHistoryIndex((idx) => idx + 1);
        return next;
      });
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setActiveGraphState(cloneGraph(history[prevIdx]));
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setActiveGraphState(cloneGraph(history[nextIdx]));
    }
  }, [historyIndex, history]);

  const loadPreset = useCallback((id: string) => {
    const found = ALL_PRESET_GRAPHS.find((g) => g.id === id);
    if (found) {
      const cloned = cloneGraph(found);
      setActiveGraphState(cloned);
      setHistory([cloneGraph(cloned)]);
      setHistoryIndex(0);
      setSelectedVertexId(null);
      setSelectedEdgeId(null);
      setHighlightedPath([]);
      setHighlightedEdges([]);
      triggerResetCamera();
    }
  }, [triggerResetCamera]);

  const setActiveTab = useCallback((tab: NavTab) => {
    setActiveTabState(tab);
    // Auto-load matching real-world or theoretical preset for great instant UX
    if (tab === "social") {
      loadPreset(SOCIAL_GRAPH_A.id);
    } else if (tab === "web") {
      loadPreset(WEB_GRAPH.id);
    } else if (tab === "campus") {
      loadPreset(CAMPUS_GRAPH.id);
    } else if (tab === "utility") {
      loadPreset(UTILITY_GRAPH.id);
    } else if (tab === "comparison") {
      setComparisonGraphA(cloneGraph(SOCIAL_GRAPH_A));
      setComparisonGraphB(cloneGraph(SOCIAL_GRAPH_B));
    }
  }, [loadPreset]);

  const addVertex = useCallback((vertexData: Omit<Vertex, "id"> & { id?: string }) => {
    setActiveGraph((prev) => {
      const id = vertexData.id || `v_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newV: Vertex = {
        ...vertexData,
        id,
      };
      return {
        ...prev,
        vertices: [...prev.vertices, newV],
      };
    });
  }, [setActiveGraph]);

  const updateVertex = useCallback((id: string, updates: Partial<Vertex>) => {
    setActiveGraph((prev) => ({
      ...prev,
      vertices: prev.vertices.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  }, [setActiveGraph]);

  const removeVertex = useCallback((id: string) => {
    setActiveGraph((prev) => ({
      ...prev,
      vertices: prev.vertices.filter((v) => v.id !== id),
      edges: prev.edges.filter((e) => e.source !== id && e.target !== id),
    }));
    setSelectedVertexId((curr) => (curr === id ? null : curr));
  }, [setActiveGraph]);

  const addEdge = useCallback((edgeData: Omit<Edge, "id"> & { id?: string }) => {
    setActiveGraph((prev) => {
      const id = edgeData.id || `e_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newE: Edge = {
        ...edgeData,
        id,
      };
      return {
        ...prev,
        edges: [...prev.edges, newE],
      };
    });
  }, [setActiveGraph]);

  const removeEdge = useCallback((id: string) => {
    setActiveGraph((prev) => ({
      ...prev,
      edges: prev.edges.filter((e) => e.id !== id),
    }));
    setSelectedEdgeId((curr) => (curr === id ? null : curr));
  }, [setActiveGraph]);

  const clearGraph = useCallback(() => {
    setActiveGraph((prev) => ({
      ...prev,
      vertices: [],
      edges: [],
    }));
    setSelectedVertexId(null);
    setSelectedEdgeId(null);
    setHighlightedPath([]);
    setHighlightedEdges([]);
  }, [setActiveGraph]);

  const contextValue = useMemo<GraphStoreState>(() => ({
    activeTab,
    setActiveTab,
    activeGraph,
    setActiveGraph,
    loadPreset,
    comparisonGraphA,
    comparisonGraphB,
    setComparisonGraphA,
    setComparisonGraphB,
    selectedVertexId,
    setSelectedVertexId,
    selectedEdgeId,
    setSelectedEdgeId,
    hoveredVertexId,
    setHoveredVertexId,
    highlightedPath,
    setHighlightedPath,
    highlightedEdges,
    setHighlightedEdges,
    visualSettings,
    updateVisualSettings,
    resetCameraCounter,
    triggerResetCamera,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    addVertex,
    updateVertex,
    removeVertex,
    addEdge,
    removeEdge,
    clearGraph,
  }), [
    activeTab,
    setActiveTab,
    activeGraph,
    setActiveGraph,
    loadPreset,
    comparisonGraphA,
    comparisonGraphB,
    selectedVertexId,
    selectedEdgeId,
    hoveredVertexId,
    highlightedPath,
    highlightedEdges,
    visualSettings,
    updateVisualSettings,
    resetCameraCounter,
    triggerResetCamera,
    historyIndex,
    history.length,
    undo,
    redo,
    addVertex,
    updateVertex,
    removeVertex,
    addEdge,
    removeEdge,
    clearGraph,
  ]);

  return (
    <GraphContext.Provider value={contextValue}>
      {children}
    </GraphContext.Provider>
  );
};
