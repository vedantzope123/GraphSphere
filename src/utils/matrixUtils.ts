import { Graph } from "../types/graph";

export interface AdjacencyMatrixData {
  labels: string[];
  ids: string[];
  matrix: (number | string)[][];
}

export interface AdjacencyListEntry {
  vertexId: string;
  vertexLabel: string;
  neighbors: {
    targetId: string;
    targetLabel: string;
    weight?: number;
    edgeId: string;
  }[];
}

export interface EdgeListEntry {
  id: string;
  sourceId: string;
  sourceLabel: string;
  targetId: string;
  targetLabel: string;
  directed: boolean;
  weight?: number;
  type?: string;
}

export interface IncidenceMatrixData {
  vertexLabels: string[];
  edgeLabels: string[];
  matrix: number[][]; // [vertexIdx][edgeIdx]
}

export function calculateAdjacencyMatrix(graph: Graph): AdjacencyMatrixData {
  const ids = graph.vertices.map((v) => v.id);
  const labels = graph.vertices.map((v) => v.label);
  const n = ids.length;

  const matrix: (number | string)[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0)
  );

  const idToIndex = new Map<string, number>();
  ids.forEach((id, idx) => idToIndex.set(id, idx));

  for (const edge of graph.edges) {
    const u = idToIndex.get(edge.source);
    const v = idToIndex.get(edge.target);
    if (u !== undefined && v !== undefined) {
      const val = graph.weighted && edge.weight !== undefined ? edge.weight : 1;
      matrix[u][v] = val;
      if (!graph.directed) {
        matrix[v][u] = val;
      }
    }
  }

  return { labels, ids, matrix };
}

export const getAdjacencyMatrix = calculateAdjacencyMatrix;

export function calculateAdjacencyList(graph: Graph): AdjacencyListEntry[] {
  const idToVertex = new Map<string, string>();
  graph.vertices.forEach((v) => idToVertex.set(v.id, v.label));

  return graph.vertices.map((vertex) => {
    const neighbors: {
      targetId: string;
      targetLabel: string;
      weight?: number;
      edgeId: string;
    }[] = [];

    for (const edge of graph.edges) {
      if (edge.source === vertex.id) {
        neighbors.push({
          targetId: edge.target,
          targetLabel: idToVertex.get(edge.target) || edge.target,
          weight: edge.weight,
          edgeId: edge.id,
        });
      } else if (!graph.directed && edge.target === vertex.id) {
        neighbors.push({
          targetId: edge.source,
          targetLabel: idToVertex.get(edge.source) || edge.source,
          weight: edge.weight,
          edgeId: edge.id,
        });
      }
    }

    return {
      vertexId: vertex.id,
      vertexLabel: vertex.label,
      neighbors,
    };
  });
}

export const getAdjacencyList = calculateAdjacencyList;

export function calculateEdgeList(graph: Graph): EdgeListEntry[] {
  const idToVertex = new Map<string, string>();
  graph.vertices.forEach((v) => idToVertex.set(v.id, v.label));

  return graph.edges.map((edge) => ({
    id: edge.id,
    sourceId: edge.source,
    sourceLabel: idToVertex.get(edge.source) || edge.source,
    targetId: edge.target,
    targetLabel: idToVertex.get(edge.target) || edge.target,
    directed: graph.directed,
    weight: edge.weight,
    type: edge.type,
  }));
}

export const getEdgeList = calculateEdgeList;

export function getIncidenceMatrix(graph: Graph): IncidenceMatrixData {
  const vertexLabels = graph.vertices.map((v) => v.label);
  const edgeLabels = graph.edges.map((e, idx) => `e${idx + 1}`);
  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;

  const matrix: number[][] = Array.from({ length: vCount }, () =>
    Array.from({ length: eCount }, () => 0)
  );

  const vertexIndexMap = new Map<string, number>();
  graph.vertices.forEach((v, idx) => vertexIndexMap.set(v.id, idx));

  graph.edges.forEach((edge, eIdx) => {
    const uIdx = vertexIndexMap.get(edge.source);
    const vIdx = vertexIndexMap.get(edge.target);

    if (uIdx !== undefined && vIdx !== undefined) {
      if (graph.directed) {
        matrix[uIdx][eIdx] = 1; // Tail / Outgoing
        matrix[vIdx][eIdx] = -1; // Head / Incoming
      } else {
        if (uIdx === vIdx) {
          matrix[uIdx][eIdx] = 2; // Loop
        } else {
          matrix[uIdx][eIdx] = 1;
          matrix[vIdx][eIdx] = 1;
        }
      }
    }
  });

  return { vertexLabels, edgeLabels, matrix };
}
