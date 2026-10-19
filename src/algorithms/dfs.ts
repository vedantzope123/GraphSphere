import { Graph, AlgorithmStep } from "../types/graph";

export interface TraversalResult {
  steps: AlgorithmStep[];
  visitOrder: string[];
  visitOrderLabels: string[];
  traversalTreeEdges: string[];
}

export function runDFS(graph: Graph, startId: string): TraversalResult {
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
  const stack: string[] = [startId];
  const visitOrder: string[] = [];
  const traversalTreeEdges: string[] = [];

  steps.push({
    stepIndex: 0,
    currentVertex: startId,
    visitedVertices: [],
    activeEdges: [],
    queueOrStack: [...stack],
    description: `Push start vertex ${vertexMap.get(startId) || startId} onto DFS stack.`,
  });

  let stepCount = 1;

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (!visited.has(current)) {
      visited.add(current);
      visitOrder.push(current);

      const neighbors = adj.get(current) || [];
      const activeEdgesThisStep: string[] = [];

      for (let i = neighbors.length - 1; i >= 0; i--) {
        const { target, edgeId } = neighbors[i];
        if (!visited.has(target)) {
          stack.push(target);
          if (!traversalTreeEdges.includes(edgeId)) {
            traversalTreeEdges.push(edgeId);
            activeEdgesThisStep.push(edgeId);
          }
        }
      }

      steps.push({
        stepIndex: stepCount++,
        currentVertex: current,
        visitedVertices: Array.from(visited),
        activeEdges: activeEdgesThisStep,
        queueOrStack: [...stack],
        description: `Popped & visited ${vertexMap.get(current)}. Stack state: [${stack
          .map((id) => vertexMap.get(id))
          .join(", ")}].`,
      });
    }
  }

  return {
    steps,
    visitOrder,
    visitOrderLabels: visitOrder.map((id) => vertexMap.get(id) || id),
    traversalTreeEdges,
  };
}
