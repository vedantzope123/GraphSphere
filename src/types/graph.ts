export type VertexType = "user" | "location" | "website" | "house" | "utility" | "custom";

export type EdgeType = "follow" | "friend" | "road" | "link" | "utility" | "custom";

export interface Vertex {
  id: string;
  label: string;
  type?: VertexType;
  position: [number, number, number];
  color?: string;
  metadata?: Record<string, any>;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  directed: boolean;
  weight?: number;
  type?: EdgeType;
  color?: string;
  label?: string;
}

export interface Graph {
  id: string;
  name: string;
  description?: string;
  vertices: Vertex[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
  category?: "social" | "web" | "campus" | "utility" | "math" | "custom";
}

export interface VertexDegreeInfo {
  id: string;
  label: string;
  degree: number;
  inDegree: number;
  outDegree: number;
  isIsolated: boolean;
  isPendant: boolean;
}

export interface GraphStats {
  vertexCount: number;
  edgeCount: number;
  averageDegree: number;
  density: number;
  componentCount: number;
  isConnected: boolean;
  isWeaklyConnected?: boolean;
  isStronglyConnected?: boolean;
  hasCycle: boolean;
  isRegular: boolean;
  regularDegree?: number;
  isComplete: boolean;
  isBipartite: boolean;
  bipartiteSets?: [string[], string[]];
  isTree: boolean;
  isPlanar: boolean;
  planarityReason: string;
  hasEulerPath: boolean;
  hasEulerCircuit: boolean;
  eulerStatusMessage: string;
  hasHamiltonPath?: boolean;
  hasHamiltonCircuit?: boolean;
  hamiltonStatusMessage?: string;
}

export interface DijkstraStep {
  currentVertex: string;
  distances: Record<string, number>;
  visited: string[];
  unvisited: string[];
  previous: Record<string, string | null>;
  description: string;
  highlightEdges: string[];
}

export interface AlgorithmStep {
  stepIndex: number;
  currentVertex?: string;
  visitedVertices: string[];
  activeEdges: string[];
  description: string;
  queueOrStack?: string[];
  data?: Record<string, any>;
}

export interface ComparisonResult {
  graphA: Graph;
  graphB: Graph;
  statsA: GraphStats;
  statsB: GraphStats;
  isomorphic: boolean;
  isomorphismReason: string;
  vertexMapping?: Record<string, string>;
  vertexMappingLabels?: Record<string, string>;
  comparisonRows: {
    category: "Basic" | "Structural" | "Properties" | "Algorithms" | "Isomorphism";
    feature: string;
    valA: string;
    valB: string;
    status: "same" | "different" | "na";
  }[];
  conclusion: string;
}
