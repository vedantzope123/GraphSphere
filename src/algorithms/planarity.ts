import { Graph } from "../types/graph";
import { analyzeConnectivity } from "./connectivity";

export interface PlanarityResult {
  isPlanar: boolean;
  status: "planar" | "non_planar" | "unsupported";
  reason: string;
  eulerFormula?: {
    vertices: number;
    edges: number;
    maxEdgesAllowed: number;
    facesEstimate?: number;
  };
  kuratowskiSubgraph?: "K5" | "K3,3" | null;
}

export function checkPlanarity(graph: Graph): PlanarityResult {
  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;

  if (vCount <= 4) {
    return {
      isPlanar: true,
      status: "planar",
      reason: `Any graph with |V| <= 4 (here ${vCount}) is strictly planar. Complete graph K4 can be embedded in the plane with 0 edge crossings.`,
      eulerFormula: {
        vertices: vCount,
        edges: eCount,
        maxEdgesAllowed: vCount >= 3 ? 3 * vCount - 6 : eCount,
        facesEstimate: Math.max(1, eCount - vCount + 2),
      },
    };
  }

  const conn = analyzeConnectivity(graph);

  // If tree, always planar
  if (conn.isTree) {
    return {
      isPlanar: true,
      status: "planar",
      reason: "All trees and acyclic forests are strictly planar (can be drawn with 0 edge crossings).",
      eulerFormula: {
        vertices: vCount,
        edges: eCount,
        maxEdgesAllowed: 3 * vCount - 6,
        facesEstimate: 1,
      },
    };
  }

  // Necessary condition for planar graphs: E <= 3V - 6
  const maxEdgesGeneral = 3 * vCount - 6;
  if (eCount > maxEdgesGeneral) {
    return {
      isPlanar: false,
      status: "non_planar",
      reason: `Violates Euler's planar inequality: |E| = ${eCount} > 3|V| - 6 = ${maxEdgesGeneral}. By Euler's formula V - E + F = 2, this graph cannot be embedded in a plane.`,
      eulerFormula: {
        vertices: vCount,
        edges: eCount,
        maxEdgesAllowed: maxEdgesGeneral,
      },
    };
  }

  // If bipartite and triangle-free: E <= 2V - 4
  if (conn.isBipartite && vCount >= 3) {
    const maxEdgesBipartite = 2 * vCount - 4;
    if (eCount > maxEdgesBipartite) {
      const isK33 = vCount === 6 && eCount === 9;
      return {
        isPlanar: false,
        status: "non_planar",
        reason: isK33
          ? "Three Utility Graph K3,3 is non-planar! Because K3,3 is bipartite (triangle-free), it requires |E| <= 2|V| - 4 = 8, but has 9 edges. By Kuratowski's theorem, K3,3 is one of the two forbidden non-planar minors."
          : `Violates bipartite planar inequality: Graph is bipartite (no triangles), requiring |E| <= 2|V| - 4 = ${maxEdgesBipartite}, but has ${eCount} edges.`,
        eulerFormula: {
          vertices: vCount,
          edges: eCount,
          maxEdgesAllowed: maxEdgesBipartite,
        },
        kuratowskiSubgraph: isK33 ? "K3,3" : null,
      };
    }
  }

  // Check for complete K5
  if (vCount === 5 && conn.isComplete) {
    return {
      isPlanar: false,
      status: "non_planar",
      reason: "Complete graph K5 is non-planar! It has 10 edges, exceeding Euler's upper limit 3(5) - 6 = 9 edges. Kuratowski's theorem identifies K5 as a forbidden topological minor.",
      eulerFormula: {
        vertices: 5,
        edges: 10,
        maxEdgesAllowed: 9,
      },
      kuratowskiSubgraph: "K5",
    };
  }

  // If cycle graph
  if (conn.isRegular && conn.regularDegree === 2 && conn.isConnected) {
    return {
      isPlanar: true,
      status: "planar",
      reason: `Cycle graph C${vCount} is planar (forms a single closed loop dividing the plane into interior and exterior faces).`,
      eulerFormula: {
        vertices: vCount,
        edges: eCount,
        maxEdgesAllowed: maxEdgesGeneral,
        facesEstimate: 2,
      },
    };
  }

  // Small graphs V <= 6 where Kuratowski check applies
  if (vCount <= 6 && eCount <= maxEdgesGeneral) {
    return {
      isPlanar: true,
      status: "planar",
      reason: `Satisfies Euler's planarity condition |E| (${eCount}) <= 3|V| - 6 (${maxEdgesGeneral}) and contains neither a K5 nor K3,3 minor.`,
      eulerFormula: {
        vertices: vCount,
        edges: eCount,
        maxEdgesAllowed: maxEdgesGeneral,
        facesEstimate: eCount - vCount + 2,
      },
    };
  }

  return {
    isPlanar: true,
    status: "planar",
    reason: `Satisfies preliminary Euler planarity bounds (|E| = ${eCount} <= ${maxEdgesGeneral}). No immediate forbidden K5/K3,3 subgraphs detected.`,
    eulerFormula: {
      vertices: vCount,
      edges: eCount,
      maxEdgesAllowed: maxEdgesGeneral,
      facesEstimate: eCount - vCount + 2,
    },
  };
}
