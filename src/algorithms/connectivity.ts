import { Graph } from "../types/graph";
import { getAllDegrees } from "../utils/degreeUtils";

export interface ConnectivityResult {
  components: string[][];
  componentCount: number;
  isConnected: boolean;
  isWeaklyConnected?: boolean;
  isStronglyConnected?: boolean;
  stronglyConnectedComponents?: string[][];
  hasCycle: boolean;
  cycleNodes?: string[];
  isBipartite: boolean;
  bipartiteSets?: [string[], string[]];
  isRegular: boolean;
  regularDegree?: number;
  isComplete: boolean;
  isTree: boolean;
}

export function analyzeConnectivity(graph: Graph): ConnectivityResult {
  const vertexIds = graph.vertices.map((v) => v.id);
  const n = vertexIds.length;

  if (n === 0) {
    return {
      components: [],
      componentCount: 0,
      isConnected: false,
      hasCycle: false,
      isBipartite: true,
      isRegular: true,
      isComplete: true,
      isTree: false,
    };
  }

  const undirectedAdj = new Map<string, Set<string>>();
  const directedAdj = new Map<string, Set<string>>();
  const directedRevAdj = new Map<string, Set<string>>();

  vertexIds.forEach((id) => {
    undirectedAdj.set(id, new Set());
    directedAdj.set(id, new Set());
    directedRevAdj.set(id, new Set());
  });

  for (const edge of graph.edges) {
    undirectedAdj.get(edge.source)?.add(edge.target);
    undirectedAdj.get(edge.target)?.add(edge.source);

    if (graph.directed) {
      directedAdj.get(edge.source)?.add(edge.target);
      directedRevAdj.get(edge.target)?.add(edge.source);
    } else {
      directedAdj.get(edge.source)?.add(edge.target);
      directedAdj.get(edge.target)?.add(edge.source);
    }
  }

  // Weakly connected components
  const visited = new Set<string>();
  const components: string[][] = [];

  for (const vId of vertexIds) {
    if (!visited.has(vId)) {
      const comp: string[] = [];
      const queue = [vId];
      visited.add(vId);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        comp.push(curr);

        const neighbors = undirectedAdj.get(curr) || new Set();
        for (const nbr of neighbors) {
          if (!visited.has(nbr)) {
            visited.add(nbr);
            queue.push(nbr);
          }
        }
      }
      components.push(comp);
    }
  }

  const isConnectedUndirected = components.length === 1;

  // Directed Strong Connectivity (Kosaraju's Algorithm)
  let isStronglyConnected = false;
  let stronglyConnectedComponents: string[][] = [];

  if (graph.directed) {
    const sccVisited = new Set<string>();
    const finishOrder: string[] = [];

    function dfs1(u: string) {
      sccVisited.add(u);
      for (const v of directedAdj.get(u) || []) {
        if (!sccVisited.has(v)) dfs1(v);
      }
      finishOrder.push(u);
    }

    for (const vId of vertexIds) {
      if (!sccVisited.has(vId)) dfs1(vId);
    }

    const sccVisited2 = new Set<string>();
    function dfs2(u: string, currentScc: string[]) {
      sccVisited2.add(u);
      currentScc.push(u);
      for (const v of directedRevAdj.get(u) || []) {
        if (!sccVisited2.has(v)) dfs2(v, currentScc);
      }
    }

    while (finishOrder.length > 0) {
      const u = finishOrder.pop()!;
      if (!sccVisited2.has(u)) {
        const scc: string[] = [];
        dfs2(u, scc);
        stronglyConnectedComponents.push(scc);
      }
    }

    isStronglyConnected = stronglyConnectedComponents.length === 1 && n > 0;
  }

  // Cycle Detection
  let hasCycle = false;
  const cycleNodes: string[] = [];

  if (graph.directed) {
    const state = new Map<string, number>();

    function dfsCycleDirected(u: string): boolean {
      state.set(u, 1);
      for (const v of directedAdj.get(u) || []) {
        if (state.get(v) === 1) {
          cycleNodes.push(v, u);
          return true;
        }
        if (state.get(v) === 0 || !state.has(v)) {
          if (dfsCycleDirected(v)) return true;
        }
      }
      state.set(u, 2);
      return false;
    }

    for (const vId of vertexIds) {
      if (!state.has(vId) || state.get(vId) === 0) {
        if (dfsCycleDirected(vId)) {
          hasCycle = true;
          break;
        }
      }
    }
  } else {
    const unVisitedSet = new Set<string>();
    function dfsCycleUndirected(u: string, parent: string | null): boolean {
      unVisitedSet.add(u);
      for (const v of undirectedAdj.get(u) || []) {
        if (!unVisitedSet.has(v)) {
          if (dfsCycleUndirected(v, u)) return true;
        } else if (v !== parent) {
          cycleNodes.push(v, u);
          return true;
        }
      }
      return false;
    }

    for (const vId of vertexIds) {
      if (!unVisitedSet.has(vId)) {
        if (dfsCycleUndirected(vId, null)) {
          hasCycle = true;
          break;
        }
      }
    }
  }

  // Bipartite Detection (2-coloring)
  let isBipartite = true;
  const colorMap = new Map<string, number>();
  const set0: string[] = [];
  const set1: string[] = [];

  for (const vId of vertexIds) {
    if (!colorMap.has(vId)) {
      colorMap.set(vId, 0);
      set0.push(vId);
      const queue = [vId];

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const currColor = colorMap.get(curr)!;
        const nextColor = 1 - currColor;

        const neighbors = undirectedAdj.get(curr) || new Set();
        for (const nbr of neighbors) {
          if (!colorMap.has(nbr)) {
            colorMap.set(nbr, nextColor);
            if (nextColor === 0) set0.push(nbr);
            else set1.push(nbr);
            queue.push(nbr);
          } else if (colorMap.get(nbr) === currColor) {
            isBipartite = false;
            break;
          }
        }
        if (!isBipartite) break;
      }
    }
    if (!isBipartite) break;
  }

  // Regular Graph Check
  const degreeInfos = getAllDegrees(graph);
  const firstDeg = degreeInfos[0]?.degree ?? 0;
  const isRegular = degreeInfos.length > 0 && degreeInfos.every((d) => d.degree === firstDeg);
  const regularDegree = isRegular ? firstDeg : undefined;

  // Complete Graph Check
  const numEdges = graph.edges.length;
  let isComplete = false;
  if (!graph.directed) {
    const edgePairSet = new Set<string>();
    for (const e of graph.edges) {
      if (e.source !== e.target) {
        const [a, b] = e.source < e.target ? [e.source, e.target] : [e.target, e.source];
        edgePairSet.add(`${a}--${b}`);
      }
    }
    const maxEdges = (n * (n - 1)) / 2;
    isComplete = n > 0 && edgePairSet.size === maxEdges;
  } else {
    const edgePairSet = new Set<string>();
    for (const e of graph.edges) {
      if (e.source !== e.target) {
        edgePairSet.add(`${e.source}->${e.target}`);
      }
    }
    const maxEdges = n * (n - 1);
    isComplete = n > 0 && edgePairSet.size === maxEdges;
  }

  // Tree Check
  const isTree = !graph.directed && isConnectedUndirected && !hasCycle && numEdges === n - 1;

  return {
    components,
    componentCount: components.length,
    isConnected: graph.directed ? isStronglyConnected : isConnectedUndirected,
    isWeaklyConnected: graph.directed ? isConnectedUndirected : undefined,
    isStronglyConnected: graph.directed ? isStronglyConnected : undefined,
    stronglyConnectedComponents: graph.directed ? stronglyConnectedComponents : undefined,
    hasCycle,
    cycleNodes,
    isBipartite,
    bipartiteSets: isBipartite ? [set0, set1] : undefined,
    isRegular,
    regularDegree,
    isComplete,
    isTree,
  };
}
