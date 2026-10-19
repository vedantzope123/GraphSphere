import { Graph, DijkstraStep } from "../types/graph";

export interface DijkstraResult {
  steps: DijkstraStep[];
  path: string[];
  pathLabels: string[];
  totalDistance: number;
  visitedCount: number;
  isReachable: boolean;
  pathEdgeIds: string[];
}

export function runDijkstra(graph: Graph, startId: string, targetId: string): DijkstraResult {
  const steps: DijkstraStep[] = [];
  const vertexMap = new Map(graph.vertices.map((v) => [v.id, v.label]));

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const unvisited = new Set<string>();

  const adj = new Map<string, { neighbor: string; weight: number; edgeId: string }[]>();
  graph.vertices.forEach((v) => {
    adj.set(v.id, []);
    distances[v.id] = Infinity;
    previous[v.id] = null;
    unvisited.add(v.id);
  });

  graph.edges.forEach((edge) => {
    const w = edge.weight !== undefined ? Math.max(0, edge.weight) : 1;
    adj.get(edge.source)?.push({ neighbor: edge.target, weight: w, edgeId: edge.id });
    if (!graph.directed) {
      adj.get(edge.target)?.push({ neighbor: edge.source, weight: w, edgeId: edge.id });
    }
  });

  if (!unvisited.has(startId)) {
    return {
      steps: [],
      path: [],
      pathLabels: [],
      totalDistance: Infinity,
      visitedCount: 0,
      isReachable: false,
      pathEdgeIds: [],
    };
  }

  distances[startId] = 0;

  steps.push({
    currentVertex: startId,
    distances: { ...distances },
    visited: Array.from(visited),
    unvisited: Array.from(unvisited),
    previous: { ...previous },
    description: `Initialize Dijkstra: Start at ${vertexMap.get(startId) || startId} with distance 0. All other nodes at ∞.`,
    highlightEdges: [],
  });

  while (unvisited.size > 0) {
    let minNode: string | null = null;
    let minDistance = Infinity;

    for (const vId of unvisited) {
      if (distances[vId] < minDistance) {
        minDistance = distances[vId];
        minNode = vId;
      }
    }

    if (!minNode || minDistance === Infinity) {
      break;
    }

    const current = minNode;
    unvisited.delete(current);
    visited.add(current);

    const activeEdgesForStep: string[] = [];
    const nbrs = adj.get(current) || [];

    for (const edgeObj of nbrs) {
      const neighbor = edgeObj.neighbor;
      if (!visited.has(neighbor)) {
        const alt = distances[current] + edgeObj.weight;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
          activeEdgesForStep.push(edgeObj.edgeId);
        }
      }
    }

    steps.push({
      currentVertex: current,
      distances: { ...distances },
      visited: Array.from(visited),
      unvisited: Array.from(unvisited),
      previous: { ...previous },
      description: `Examining ${vertexMap.get(current)} (cost ${distances[current]}). Updated neighbor tentative costs.`,
      highlightEdges: activeEdgesForStep,
    });

    if (current === targetId) {
      break;
    }
  }

  // Reconstruct path
  const path: string[] = [];
  const pathEdgeIds: string[] = [];
  let curr: string | null = targetId;

  if (distances[targetId] !== Infinity) {
    while (curr) {
      path.unshift(curr);
      const prev: string | null = previous[curr];
      if (prev) {
        const foundEdge = graph.edges.find(
          (e) =>
            (e.source === prev && e.target === curr) ||
            (!graph.directed && e.source === curr && e.target === prev)
        );
        if (foundEdge) {
          pathEdgeIds.unshift(foundEdge.id);
        }
      }
      curr = prev;
    }
  }

  const isReachable = distances[targetId] !== Infinity && path.length > 0 && path[0] === startId;
  const pathLabels = path.map((id) => vertexMap.get(id) || id);

  if (isReachable) {
    steps.push({
      currentVertex: targetId,
      distances: { ...distances },
      visited: Array.from(visited),
      unvisited: Array.from(unvisited),
      previous: { ...previous },
      description: `Shortest route found: ${pathLabels.join(" → ")} with total distance ${distances[targetId]}.`,
      highlightEdges: pathEdgeIds,
    });
  } else {
    steps.push({
      currentVertex: targetId,
      distances: { ...distances },
      visited: Array.from(visited),
      unvisited: Array.from(unvisited),
      previous: { ...previous },
      description: `Target ${vertexMap.get(targetId) || targetId} is not reachable from ${vertexMap.get(startId) || startId}.`,
      highlightEdges: [],
    });
  }

  return {
    steps,
    path: isReachable ? path : [],
    pathLabels: isReachable ? pathLabels : [],
    totalDistance: isReachable ? distances[targetId] : Infinity,
    visitedCount: visited.size,
    isReachable,
    pathEdgeIds: isReachable ? pathEdgeIds : [],
  };
}
