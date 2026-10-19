import { Graph } from "../types/graph";
import { getAllDegrees } from "../utils/degreeUtils";
import { analyzeConnectivity } from "./connectivity";

export interface ColoringResult {
  vertexColors: Record<string, number>;
  colorHexMap: Record<number, string>;
  colorsUsed: number;
  chromaticNumberKnown?: number;
  chromaticNumberExplanation: string;
  isProperColoring: boolean;
  conflictEdges: string[];
}

export const COLOR_PALETTE = [
  "#38BDF8", // Sky Blue
  "#F43F5E", // Rose Red
  "#22C55E", // Emerald Green
  "#F59E0B", // Amber
  "#A855F7", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EAB308", // Yellow
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Orange
];

export function colorGraphWelshPowell(graph: Graph): ColoringResult {
  const n = graph.vertices.length;
  if (n === 0) {
    return {
      vertexColors: {},
      colorHexMap: {},
      colorsUsed: 0,
      chromaticNumberKnown: 0,
      chromaticNumberExplanation: "Empty graph requires 0 colors.",
      isProperColoring: true,
      conflictEdges: [],
    };
  }

  const adj = new Map<string, Set<string>>();
  graph.vertices.forEach((v) => adj.set(v.id, new Set()));

  graph.edges.forEach((e) => {
    adj.get(e.source)?.add(e.target);
    adj.get(e.target)?.add(e.source);
  });

  const degs = getAllDegrees(graph);
  const sorted = [...degs].sort((a, b) => b.degree - a.degree);

  const vertexColors: Record<string, number> = {};
  let currentColor = 0;

  for (let i = 0; i < sorted.length; i++) {
    const vId = sorted[i].id;
    if (vertexColors[vId] !== undefined) continue;

    vertexColors[vId] = currentColor;

    for (let j = i + 1; j < sorted.length; j++) {
      const uId = sorted[j].id;
      if (vertexColors[uId] !== undefined) continue;

      let canAssign = true;
      for (const [coloredId, c] of Object.entries(vertexColors)) {
        if (c === currentColor && adj.get(uId)?.has(coloredId)) {
          canAssign = false;
          break;
        }
      }

      if (canAssign) {
        vertexColors[uId] = currentColor;
      }
    }

    currentColor++;
  }

  const colorsUsed = currentColor;

  let isProper = true;
  const conflictEdges: string[] = [];
  graph.edges.forEach((e) => {
    if (vertexColors[e.source] !== undefined && vertexColors[e.source] === vertexColors[e.target]) {
      isProper = false;
      conflictEdges.push(e.id);
    }
  });

  const conn = analyzeConnectivity(graph);
  let chromaticNumberKnown: number | undefined;
  let explanation = `Greedy Welsh-Powell used ${colorsUsed} color(s). Upper bounded by Δ(G) + 1 = ${
    (sorted[0]?.degree ?? 0) + 1
  } (Brooks' theorem).`;

  if (graph.edges.length === 0) {
    chromaticNumberKnown = 1;
    explanation = "Exact chromatic number χ(G) = 1 (Graph has no edges; all vertices are independent).";
  } else if (conn.isComplete) {
    chromaticNumberKnown = n;
    explanation = `Exact chromatic number χ(K${n}) = ${n} (Complete graph requires a distinct color for each vertex).`;
  } else if (conn.isBipartite) {
    chromaticNumberKnown = 2;
    explanation = `Exact chromatic number χ(G) = 2 (Graph is bipartite with at least one edge; 2 sets can each share a color).`;
  } else if (conn.isTree) {
    chromaticNumberKnown = 2;
    explanation = "Exact chromatic number χ(T) = 2 (Every non-trivial tree is a 2-colorable bipartite graph).";
  }

  const colorHexMap: Record<number, string> = {};
  for (let i = 0; i < colorsUsed; i++) {
    colorHexMap[i] = COLOR_PALETTE[i % COLOR_PALETTE.length];
  }

  return {
    vertexColors,
    colorHexMap,
    colorsUsed,
    chromaticNumberKnown,
    chromaticNumberExplanation: explanation,
    isProperColoring: isProper,
    conflictEdges,
  };
}
