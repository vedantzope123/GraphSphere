import { Graph, GraphStats, Vertex, Edge, VertexType } from "../types/graph";
import { calculateAverageDegree, calculateDensity } from "./degreeUtils";
import { analyzeConnectivity } from "../algorithms/connectivity";
import { analyzeEuler } from "../algorithms/euler";
import { analyzeHamiltonian } from "../algorithms/hamiltonian";
import { checkPlanarity } from "../algorithms/planarity";

export function calculateGraphStats(graph: Graph): GraphStats {
  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;
  const avgDeg = calculateAverageDegree(graph);
  const density = calculateDensity(graph);

  const conn = analyzeConnectivity(graph);
  const euler = analyzeEuler(graph);
  const hamilton = analyzeHamiltonian(graph, 14);
  const planarity = checkPlanarity(graph);

  return {
    vertexCount: vCount,
    edgeCount: eCount,
    averageDegree: avgDeg,
    density,
    componentCount: conn.componentCount,
    isConnected: conn.isConnected,
    isWeaklyConnected: conn.isWeaklyConnected,
    isStronglyConnected: conn.isStronglyConnected,
    hasCycle: conn.hasCycle,
    isRegular: conn.isRegular,
    regularDegree: conn.regularDegree,
    isComplete: conn.isComplete,
    isBipartite: conn.isBipartite,
    bipartiteSets: conn.bipartiteSets,
    isTree: conn.isTree,
    isPlanar: planarity.isPlanar,
    planarityReason: planarity.reason,
    hasEulerPath: euler.hasEulerPath,
    hasEulerCircuit: euler.hasEulerCircuit,
    eulerStatusMessage: euler.message,
    hasHamiltonPath: hamilton.hasHamiltonPath,
    hasHamiltonCircuit: hamilton.hasHamiltonCircuit,
    hamiltonStatusMessage: hamilton.message,
  };
}

export function cloneGraph(graph: Graph): Graph {
  return {
    id: graph.id,
    name: graph.name,
    description: graph.description,
    directed: graph.directed,
    weighted: graph.weighted,
    category: graph.category,
    vertices: graph.vertices.map((v) => ({
      ...v,
      position: [...v.position] as [number, number, number],
      metadata: v.metadata ? { ...v.metadata } : undefined,
    })),
    edges: graph.edges.map((e) => ({ ...e })),
  };
}

export function createEmptyGraph(id: string, name: string, directed = false, weighted = false): Graph {
  return {
    id,
    name,
    vertices: [],
    edges: [],
    directed,
    weighted,
    category: "custom",
  };
}

export function getNextLabel(existingVertices: Vertex[]): string {
  const used = new Set(existingVertices.map((v) => v.label));
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(65 + i);
    if (!used.has(char)) return char;
  }
  let num = 1;
  while (used.has(`v${num}`)) {
    num++;
  }
  return `v${num}`;
}

export function addVertex(
  graph: Graph,
  label?: string,
  position?: [number, number, number],
  type: VertexType = "custom"
): Graph {
  const newLabel = label || getNextLabel(graph.vertices);
  const id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  let pos = position;
  if (!pos) {
    const n = graph.vertices.length;
    const angle = (n * 2 * Math.PI) / Math.max(1, n + 1);
    const radius = 3.5;
    pos = [Number((Math.cos(angle) * radius).toFixed(2)), 0, Number((Math.sin(angle) * radius).toFixed(2))];
  }

  const newVertex: Vertex = {
    id,
    label: newLabel,
    type,
    position: pos,
  };

  return {
    ...graph,
    vertices: [...graph.vertices, newVertex],
  };
}

export function removeVertex(graph: Graph, vertexId: string): Graph {
  return {
    ...graph,
    vertices: graph.vertices.filter((v) => v.id !== vertexId),
    edges: graph.edges.filter((e) => e.source !== vertexId && e.target !== vertexId),
  };
}

export function updateVertex(graph: Graph, vertexId: string, updates: Partial<Vertex>): Graph {
  return {
    ...graph,
    vertices: graph.vertices.map((v) => (v.id === vertexId ? { ...v, ...updates } : v)),
  };
}

export function addEdge(
  graph: Graph,
  source: string,
  target: string,
  weight?: number,
  directed?: boolean
): Graph {
  const isDirected = directed !== undefined ? directed : graph.directed;
  const exists = graph.edges.some((e) => {
    if (isDirected) {
      return e.source === source && e.target === target;
    }
    return (
      (e.source === source && e.target === target) ||
      (e.source === target && e.target === source)
    );
  });

  if (exists) return graph;

  const newEdge: Edge = {
    id: `e_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    source,
    target,
    directed: isDirected,
    weight: graph.weighted ? (weight !== undefined ? weight : 1) : weight,
  };

  return {
    ...graph,
    edges: [...graph.edges, newEdge],
  };
}

export function removeEdge(graph: Graph, edgeId: string): Graph {
  return {
    ...graph,
    edges: graph.edges.filter((e) => e.id !== edgeId),
  };
}

export function updateEdge(graph: Graph, edgeId: string, updates: Partial<Edge>): Graph {
  return {
    ...graph,
    edges: graph.edges.map((e) => (e.id === edgeId ? { ...e, ...updates } : e)),
  };
}
