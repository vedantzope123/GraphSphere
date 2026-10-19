import { Graph, AlgorithmStep } from "../types/graph";

export interface TraversalResult {
  steps: AlgorithmStep[];
  visitOrder: string[];
  visitOrderLabels: string[];
  traversalTreeEdges: string[];
}

export function runBFS(graph: Graph, startId: string): TraversalResult {
  const steps: AlgorithmStep[] = [];
  const vertexMap = new Map(graph.vertices.map((v) => [v.id, v.label]));

  const adj = new Map<string, { target: string; edgeId: string }[]>();
  graph.vertices.forEach((v) => adj.set(v.id, []));

  graph.edges.forEach((e) => {
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id });
    if (!graph.directed) {
      adj.get(e.target)?.push({ target: e.source, edgeId: e.id });
    }
  });

  if (!graph.vertices.some((v) => v.id === startId)) {
    return { steps: [], visitOrder: [], visitOrderLabels: [], traversalTreeEdges: [] };
  }

  const visited = new Set<string>();
  const queue: string[] = [startId];
  visited.add(startId);
  const visitOrder: string[] = [];
  const traversalTreeEdges: string[] = [];

  steps.push({
    stepIndex: 0,
    currentVertex: startId,
    visitedVertices: Array.from(visited),
    activeEdges: [],
    queueOrStack: [...queue],
    description: `Enqueue starting vertex: ${vertexMap.get(startId) || startId}. Mark as visited.`,
  });

  let stepCount = 1;

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitOrder.push(current);

    const neighbors = adj.get(current) || [];
    const activeEdgesThisStep: string[] = [];

    for (const { target, edgeId } of neighbors) {
      if (!visited.has(target)) {
        visited.add(target);
        queue.push(target);
        traversalTreeEdges.push(edgeId);
        activeEdgesThisStep.push(edgeId);
      }
    }

    steps.push({
      stepIndex: stepCount++,
      currentVertex: current,
      visitedVertices: Array.from(visited),
      activeEdges: activeEdgesThisStep,
      queueOrStack: [...queue],
      description: `Dequeued ${vertexMap.get(current)}. ${
        activeEdgesThisStep.length > 0
          ? `Discovered new neighbors: ${neighbors
              .filter((n) => activeEdgesThisStep.includes(n.edgeId))
              .map((n) => vertexMap.get(n.target))
              .join(", ")}`
          : `No unvisited neighbors.`
      }`,
    });
  }

  return {
    steps,
    visitOrder,
    visitOrderLabels: visitOrder.map((id) => vertexMap.get(id) || id),
    traversalTreeEdges,
  };
}
