import { Graph } from "../types/graph";

export interface HamiltonResult {
  hasHamiltonCircuit: boolean;
  hasHamiltonPath: boolean;
  pathType: "circuit" | "path" | "none" | "too_large";
  message: string;
  pathVertices: string[];
  pathLabels: string[];
  circuitVertices: string[];
  circuitLabels: string[];
  pathEdges: string[];
  circuitEdges: string[];
}

export function analyzeHamiltonian(graph: Graph, maxVertices: number = 16): HamiltonResult {
  const n = graph.vertices.length;
  const vertexMap = new Map(graph.vertices.map((v) => [v.id, v.label]));

  if (n === 0) {
    return {
      hasHamiltonCircuit: false,
      hasHamiltonPath: false,
      pathType: "none",
      message: "Graph has no vertices.",
      pathVertices: [],
      pathLabels: [],
      circuitVertices: [],
      circuitLabels: [],
      pathEdges: [],
      circuitEdges: [],
    };
  }

  if (n === 1) {
    return {
      hasHamiltonCircuit: true,
      hasHamiltonPath: true,
      pathType: "circuit",
      message: "Trivial single-vertex graph is a Hamiltonian path and circuit.",
      pathVertices: [graph.vertices[0].id],
      pathLabels: [graph.vertices[0].label],
      circuitVertices: [graph.vertices[0].id, graph.vertices[0].id],
      circuitLabels: [graph.vertices[0].label, graph.vertices[0].label],
      pathEdges: [],
      circuitEdges: [],
    };
  }

  if (n > maxVertices) {
    return {
      hasHamiltonCircuit: false,
      hasHamiltonPath: false,
      pathType: "too_large",
      message: `Hamiltonian search is computationally NP-complete and expensive for large graphs (${n} vertices > limit ${maxVertices}). Reduce the graph size to continue.`,
      pathVertices: [],
      pathLabels: [],
      circuitVertices: [],
      circuitLabels: [],
      pathEdges: [],
      circuitEdges: [],
    };
  }

  const adj = new Map<string, { target: string; edgeId: string }[]>();
  graph.vertices.forEach((v) => adj.set(v.id, []));

  graph.edges.forEach((e) => {
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id });
    if (!graph.directed) {
      adj.get(e.target)?.push({ target: e.source, edgeId: e.id });
    }
  });

  let foundCircuit: { vertices: string[]; edges: string[] } | null = null;
  let foundPath: { vertices: string[]; edges: string[] } | null = null;

  let opsCount = 0;
  const MAX_OPS = 150000;

  function backtrack(
    current: string,
    start: string,
    visited: Set<string>,
    path: string[],
    edges: string[]
  ): boolean {
    opsCount++;
    if (opsCount > MAX_OPS) return false;

    if (path.length === n) {
      if (!foundPath) {
        foundPath = { vertices: [...path], edges: [...edges] };
      }
      const closingEdge = (adj.get(current) || []).find((nbr) => nbr.target === start);
      if (closingEdge) {
        foundCircuit = {
          vertices: [...path, start],
          edges: [...edges, closingEdge.edgeId],
        };
        return true;
      }
      return false;
    }

    const neighbors = adj.get(current) || [];
    for (const { target, edgeId } of neighbors) {
      if (!visited.has(target)) {
        visited.add(target);
        path.push(target);
        edges.push(edgeId);

        const ok = backtrack(target, start, visited, path, edges);
        if (ok) return true;

        path.pop();
        edges.pop();
        visited.delete(target);
      }
    }

    return false;
  }

  for (const startVertex of graph.vertices) {
    if (foundCircuit) break;
    const visited = new Set<string>([startVertex.id]);
    backtrack(startVertex.id, startVertex.id, visited, [startVertex.id], []);
  }

  if (foundCircuit) {
    const cVerts = (foundCircuit as { vertices: string[]; edges: string[] }).vertices;
    const cEdges = (foundCircuit as { vertices: string[]; edges: string[] }).edges;
    return {
      hasHamiltonCircuit: true,
      hasHamiltonPath: true,
      pathType: "circuit",
      message: `Hamiltonian Circuit found: Visits every vertex once and returns to ${vertexMap.get(cVerts[0])}.`,
      pathVertices: cVerts.slice(0, n),
      pathLabels: cVerts.slice(0, n).map((id) => vertexMap.get(id) || id),
      circuitVertices: cVerts,
      circuitLabels: cVerts.map((id) => vertexMap.get(id) || id),
      pathEdges: cEdges.slice(0, n - 1),
      circuitEdges: cEdges,
    };
  }

  if (foundPath) {
    const pVerts = (foundPath as { vertices: string[]; edges: string[] }).vertices;
    const pEdges = (foundPath as { vertices: string[]; edges: string[] }).edges;
    return {
      hasHamiltonCircuit: false,
      hasHamiltonPath: true,
      pathType: "path",
      message: `Hamiltonian Path found: Visits every vertex exactly once, but does not close into a circuit.`,
      pathVertices: pVerts,
      pathLabels: pVerts.map((id) => vertexMap.get(id) || id),
      circuitVertices: [],
      circuitLabels: [],
      pathEdges: pEdges,
      circuitEdges: [],
    };
  }

  return {
    hasHamiltonCircuit: false,
    hasHamiltonPath: false,
    pathType: "none",
    message: "No Hamiltonian Path or Circuit exists in this graph.",
    pathVertices: [],
    pathLabels: [],
    circuitVertices: [],
    circuitLabels: [],
    pathEdges: [],
    circuitEdges: [],
  };
}
