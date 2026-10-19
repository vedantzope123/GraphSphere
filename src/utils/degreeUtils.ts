import { Graph, VertexDegreeInfo } from "../types/graph";

export function getVertexDegreeInfo(graph: Graph, vertexId: string): VertexDegreeInfo {
  const v = graph.vertices.find((n) => n.id === vertexId);
  const label = v ? v.label : vertexId;

  let inDegree = 0;
  let outDegree = 0;
  let undirectedDegree = 0;

  for (const e of graph.edges) {
    if (graph.directed) {
      if (e.source === vertexId) outDegree++;
      if (e.target === vertexId) inDegree++;
    } else {
      if (e.source === vertexId && e.target === vertexId) {
        undirectedDegree += 2;
      } else if (e.source === vertexId || e.target === vertexId) {
        undirectedDegree += 1;
      }
    }
  }

  const degree = graph.directed ? inDegree + outDegree : undirectedDegree;

  return {
    id: vertexId,
    label,
    degree,
    inDegree: graph.directed ? inDegree : degree,
    outDegree: graph.directed ? outDegree : degree,
    isIsolated: degree === 0,
    isPendant: degree === 1,
  };
}

export function getAllDegrees(graph: Graph): VertexDegreeInfo[] {
  return graph.vertices.map((v) => getVertexDegreeInfo(graph, v.id));
}

export function calculateAverageDegree(graph: Graph): number {
  if (graph.vertices.length === 0) return 0;
  const degrees = getAllDegrees(graph);
  const sum = degrees.reduce((acc, d) => acc + d.degree, 0);
  return Number((sum / graph.vertices.length).toFixed(2));
}

export function getDegreeSequence(graph: Graph): number[] {
  const degrees = getAllDegrees(graph).map((d) => d.degree);
  return degrees.sort((a, b) => b - a);
}

export function getInDegreeSequence(graph: Graph): number[] {
  const degrees = getAllDegrees(graph).map((d) => d.inDegree);
  return degrees.sort((a, b) => b - a);
}

export function getOutDegreeSequence(graph: Graph): number[] {
  const degrees = getAllDegrees(graph).map((d) => d.outDegree);
  return degrees.sort((a, b) => b - a);
}

export function calculateDensity(graph: Graph): number {
  const n = graph.vertices.length;
  if (n <= 1) return 0;
  const e = graph.edges.length;
  const maxEdges = graph.directed ? n * (n - 1) : (n * (n - 1)) / 2;
  return Number((e / maxEdges).toFixed(3));
}

export function verifyHandshakingLemma(graph: Graph): {
  isSatisfied: boolean;
  sumDegree: number;
  twoTimesEdges: number;
  sumInDegree: number;
  sumOutDegree: number;
  numEdges: number;
  equation: string;
} {
  const all = getAllDegrees(graph);
  const numEdges = graph.edges.length;

  if (graph.directed) {
    const sumIn = all.reduce((acc, d) => acc + d.inDegree, 0);
    const sumOut = all.reduce((acc, d) => acc + d.outDegree, 0);
    const sumDegree = all.reduce((acc, d) => acc + d.degree, 0);
    const isSatisfied = sumIn === numEdges && sumOut === numEdges;
    return {
      isSatisfied,
      sumDegree,
      twoTimesEdges: 2 * numEdges,
      sumInDegree: sumIn,
      sumOutDegree: sumOut,
      numEdges,
      equation: `Σ In-Deg (${sumIn}) = Σ Out-Deg (${sumOut}) = |E| (${numEdges}); Σ Deg = ${sumDegree} = 2|E|`,
    };
  } else {
    const sumDeg = all.reduce((acc, d) => acc + d.degree, 0);
    const twoTimesE = 2 * numEdges;
    const isSatisfied = sumDeg === twoTimesE;
    return {
      isSatisfied,
      sumDegree: sumDeg,
      twoTimesEdges: twoTimesE,
      sumInDegree: sumDeg,
      sumOutDegree: sumDeg,
      numEdges,
      equation: `Σ deg(v) = ${sumDeg} = 2 · |E| = 2 · ${numEdges} = ${twoTimesE}`,
    };
  }
}
