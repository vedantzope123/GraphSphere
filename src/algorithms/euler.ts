import { Graph } from "../types/graph";
import { getAllDegrees } from "../utils/degreeUtils";

export interface EulerResult {
  hasEulerCircuit: boolean;
  hasEulerPath: boolean;
  pathType: "circuit" | "path" | "none";
  oddDegreeVertices: string[];
  message: string;
  sequence: string[];
  sequenceLabels: string[];
  edgeSequence: string[];
}

export function analyzeEuler(graph: Graph): EulerResult {
  const n = graph.vertices.length;
  const m = graph.edges.length;
  const vertexMap = new Map(graph.vertices.map((v) => [v.id, v.label]));

  if (m === 0) {
    return {
      hasEulerCircuit: n > 0,
      hasEulerPath: n > 0,
      pathType: n > 0 ? "circuit" : "none",
      oddDegreeVertices: [],
      message: "An empty graph trivially has no edges to traverse.",
      sequence: [],
      sequenceLabels: [],
      edgeSequence: [],
    };
  }

  const degrees = getAllDegrees(graph);

  if (!graph.directed) {
    const oddVertices = degrees.filter((d) => d.degree % 2 !== 0).map((d) => d.id);

    const nonIsolated = graph.vertices.filter((v) => {
      const d = degrees.find((x) => x.id === v.id)?.degree ?? 0;
      return d > 0;
    });

    if (nonIsolated.length > 0) {
      const visited = new Set<string>();
      const queue = [nonIsolated[0].id];
      visited.add(nonIsolated[0].id);

      const adj = new Map<string, string[]>();
      graph.vertices.forEach((v) => adj.set(v.id, []));
      graph.edges.forEach((e) => {
        adj.get(e.source)?.push(e.target);
        adj.get(e.target)?.push(e.source);
      });

      while (queue.length > 0) {
        const curr = queue.shift()!;
        for (const nbr of adj.get(curr) || []) {
          if (!visited.has(nbr)) {
            visited.add(nbr);
            queue.push(nbr);
          }
        }
      }

      for (const nv of nonIsolated) {
        if (!visited.has(nv.id)) {
          return {
            hasEulerCircuit: false,
            hasEulerPath: false,
            pathType: "none",
            oddDegreeVertices: oddVertices,
            message: "Graph is disconnected across edge-bearing components. No Euler path exists.",
            sequence: [],
            sequenceLabels: [],
            edgeSequence: [],
          };
        }
      }
    }

    if (oddVertices.length === 0) {
      const { vertexSequence, edgeSequence } = findEulerianPathUndirected(graph, nonIsolated[0]?.id || graph.vertices[0].id);
      return {
        hasEulerCircuit: true,
        hasEulerPath: true,
        pathType: "circuit",
        oddDegreeVertices: [],
        message: "Euler Circuit exists: All vertices have even degrees (0 odd vertices).",
        sequence: vertexSequence,
        sequenceLabels: vertexSequence.map((id) => vertexMap.get(id) || id),
        edgeSequence,
      };
    } else if (oddVertices.length === 2) {
      const { vertexSequence, edgeSequence } = findEulerianPathUndirected(graph, oddVertices[0]);
      return {
        hasEulerCircuit: false,
        hasEulerPath: true,
        pathType: "path",
        oddDegreeVertices: oddVertices,
        message: `Euler Path exists: Exactly 2 vertices have odd degree (${oddVertices.map((id) => vertexMap.get(id)).join(", ")}). Path starts at one and ends at the other.`,
        sequence: vertexSequence,
        sequenceLabels: vertexSequence.map((id) => vertexMap.get(id) || id),
        edgeSequence,
      };
    } else {
      return {
        hasEulerCircuit: false,
        hasEulerPath: false,
        pathType: "none",
        oddDegreeVertices: oddVertices,
        message: `No Euler Path: Graph has ${oddVertices.length} odd-degree vertices (requires 0 for circuit, 2 for path).`,
        sequence: [],
        sequenceLabels: [],
        edgeSequence: [],
      };
    }
  } else {
    let startNode: string | null = null;
    let endNode: string | null = null;
    let hasDiff = false;
    let validPath = true;

    for (const d of degrees) {
      const diff = d.outDegree - d.inDegree;
      if (diff === 1) {
        if (startNode !== null) validPath = false;
        startNode = d.id;
        hasDiff = true;
      } else if (diff === -1) {
        if (endNode !== null) validPath = false;
        endNode = d.id;
        hasDiff = true;
      } else if (diff !== 0) {
        validPath = false;
      }
    }

    if (!validPath) {
      return {
        hasEulerCircuit: false,
        hasEulerPath: false,
        pathType: "none",
        oddDegreeVertices: [],
        message: "No Euler Path: In-degree and out-degree balance conditions are violated.",
        sequence: [],
        sequenceLabels: [],
        edgeSequence: [],
      };
    }

    const start = startNode || graph.vertices[0].id;
    const isCircuit = !hasDiff;

    const { vertexSequence, edgeSequence } = findEulerianPathDirected(graph, start);

    if (edgeSequence.length !== m) {
      return {
        hasEulerCircuit: false,
        hasEulerPath: false,
        pathType: "none",
        oddDegreeVertices: [],
        message: "Euler path conditions met locally, but graph is disconnected across edges.",
        sequence: [],
        sequenceLabels: [],
        edgeSequence: [],
      };
    }

    return {
      hasEulerCircuit: isCircuit,
      hasEulerPath: true,
      pathType: isCircuit ? "circuit" : "path",
      oddDegreeVertices: [],
      message: isCircuit
        ? "Directed Euler Circuit exists: Every vertex has in-degree == out-degree."
        : "Directed Euler Path exists from start vertex with out-degree - in-degree = 1.",
      sequence: vertexSequence,
      sequenceLabels: vertexSequence.map((id) => vertexMap.get(id) || id),
      edgeSequence,
    };
  }
}

function findEulerianPathUndirected(graph: Graph, startId: string): { vertexSequence: string[]; edgeSequence: string[] } {
  const edges = graph.edges.map((e) => ({ ...e, used: false }));
  const adj = new Map<string, { target: string; edgeIndex: number; edgeId: string }[]>();
  graph.vertices.forEach((v) => adj.set(v.id, []));

  edges.forEach((e, idx) => {
    adj.get(e.source)?.push({ target: e.target, edgeIndex: idx, edgeId: e.id });
    adj.get(e.target)?.push({ target: e.source, edgeIndex: idx, edgeId: e.id });
  });

  const pathStack: { v: string; edgeId?: string }[] = [{ v: startId }];
  const finalVertices: string[] = [];
  const finalEdges: string[] = [];

  while (pathStack.length > 0) {
    const top = pathStack[pathStack.length - 1];
    const nbrs = adj.get(top.v) || [];

    let found = false;
    while (nbrs.length > 0) {
      const next = nbrs.pop()!;
      if (!edges[next.edgeIndex].used) {
        edges[next.edgeIndex].used = true;
        pathStack.push({ v: next.target, edgeId: next.edgeId });
        found = true;
        break;
      }
    }

    if (!found) {
      const removed = pathStack.pop()!;
      finalVertices.push(removed.v);
      if (removed.edgeId) finalEdges.push(removed.edgeId);
    }
  }

  finalVertices.reverse();
  finalEdges.reverse();

  return { vertexSequence: finalVertices, edgeSequence: finalEdges };
}

function findEulerianPathDirected(graph: Graph, startId: string): { vertexSequence: string[]; edgeSequence: string[] } {
  const edges = graph.edges.map((e) => ({ ...e, used: false }));
  const adj = new Map<string, { target: string; edgeIndex: number; edgeId: string }[]>();
  graph.vertices.forEach((v) => adj.set(v.id, []));

  edges.forEach((e, idx) => {
    adj.get(e.source)?.push({ target: e.target, edgeIndex: idx, edgeId: e.id });
  });

  const pathStack: { v: string; edgeId?: string }[] = [{ v: startId }];
  const finalVertices: string[] = [];
  const finalEdges: string[] = [];

  while (pathStack.length > 0) {
    const top = pathStack[pathStack.length - 1];
    const nbrs = adj.get(top.v) || [];

    let found = false;
    while (nbrs.length > 0) {
      const next = nbrs.pop()!;
      if (!edges[next.edgeIndex].used) {
        edges[next.edgeIndex].used = true;
        pathStack.push({ v: next.target, edgeId: next.edgeId });
        found = true;
        break;
      }
    }

    if (!found) {
      const removed = pathStack.pop()!;
      finalVertices.push(removed.v);
      if (removed.edgeId) finalEdges.push(removed.edgeId);
    }
  }

  finalVertices.reverse();
  finalEdges.reverse();

  return { vertexSequence: finalVertices, edgeSequence: finalEdges };
}
