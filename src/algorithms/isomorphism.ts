import { Graph } from "../types/graph";
import { getAllDegrees, getDegreeSequence, getInDegreeSequence, getOutDegreeSequence } from "../utils/degreeUtils";
import { analyzeConnectivity } from "./connectivity";

export interface IsomorphismResult {
  isIsomorphic: boolean;
  reason: string;
  invariantsMatch: boolean;
  vertexMapping?: Record<string, string>;
  vertexMappingLabels?: Record<string, string>;
  stepsSummary: string[];
}

export function checkIsomorphism(graphA: Graph, graphB: Graph, maxVertices: number = 14): IsomorphismResult {
  const steps: string[] = [];
  const vCountA = graphA.vertices.length;
  const vCountB = graphB.vertices.length;
  const eCountA = graphA.edges.length;
  const eCountB = graphB.edges.length;

  if (vCountA !== vCountB) {
    const reason = `Vertex counts differ: |V(A)| = ${vCountA} vs |V(B)| = ${vCountB}.`;
    return {
      isIsomorphic: false,
      reason,
      invariantsMatch: false,
      stepsSummary: [reason],
    };
  }
  steps.push(`✓ Vertex counts match: |V| = ${vCountA}`);

  if (eCountA !== eCountB) {
    const reason = `Edge counts differ: |E(A)| = ${eCountA} vs |E(B)| = ${eCountB}.`;
    return {
      isIsomorphic: false,
      reason,
      invariantsMatch: false,
      stepsSummary: [...steps, reason],
    };
  }
  steps.push(`✓ Edge counts match: |E| = ${eCountA}`);

  if (graphA.directed !== graphB.directed) {
    const reason = `Directedness mismatch: Graph A is ${graphA.directed ? "directed" : "undirected"}, but Graph B is ${graphB.directed ? "directed" : "undirected"}.`;
    return {
      isIsomorphic: false,
      reason,
      invariantsMatch: false,
      stepsSummary: [...steps, reason],
    };
  }

  if (!graphA.directed) {
    const degSeqA = getDegreeSequence(graphA);
    const degSeqB = getDegreeSequence(graphB);
    const seqMatch = degSeqA.every((val, idx) => val === degSeqB[idx]);
    if (!seqMatch) {
      const reason = `Degree sequences differ: [${degSeqA.join(", ")}] vs [${degSeqB.join(", ")}].`;
      return {
        isIsomorphic: false,
        reason,
        invariantsMatch: false,
        stepsSummary: [...steps, reason],
      };
    }
    steps.push(`✓ Degree sequences match: [${degSeqA.join(", ")}]`);
  } else {
    const inA = getInDegreeSequence(graphA);
    const inB = getInDegreeSequence(graphB);
    const outA = getOutDegreeSequence(graphA);
    const outB = getOutDegreeSequence(graphB);
    const match = inA.every((v, i) => v === inB[i]) && outA.every((v, i) => v === outB[i]);
    if (!match) {
      const reason = `In/Out degree sequences differ between graphs.`;
      return {
        isIsomorphic: false,
        reason,
        invariantsMatch: false,
        stepsSummary: [...steps, reason],
      };
    }
    steps.push(`✓ In-degree & Out-degree sequences match`);
  }

  const connA = analyzeConnectivity(graphA);
  const connB = analyzeConnectivity(graphB);
  if (connA.componentCount !== connB.componentCount) {
    const reason = `Connected component counts differ: ${connA.componentCount} vs ${connB.componentCount}.`;
    return {
      isIsomorphic: false,
      reason,
      invariantsMatch: false,
      stepsSummary: [...steps, reason],
    };
  }
  steps.push(`✓ Connected components count matches: ${connA.componentCount}`);

  if (vCountA === 0) {
    return {
      isIsomorphic: true,
      reason: "Both graphs are empty (0 vertices).",
      invariantsMatch: true,
      vertexMapping: {},
      vertexMappingLabels: {},
      stepsSummary: [...steps, "✓ Empty graphs are isomorphic"],
    };
  }

  if (vCountA > maxVertices) {
    return {
      isIsomorphic: false,
      reason: `All structural invariants match (vertices, edges, degree sequence, components), but exact bijective verification is NP-intermediate and skipped for |V| > ${maxVertices}.`,
      invariantsMatch: true,
      stepsSummary: [...steps, "Invariant match verified; graph size exceeds exhaustive permutation threshold."],
    };
  }

  const degA = getAllDegrees(graphA);
  const degB = getAllDegrees(graphB);

  const vA = graphA.vertices;
  const vB = graphB.vertices;

  const idAtoIdx = new Map(vA.map((v, i) => [v.id, i]));
  const idBtoIdx = new Map(vB.map((v, i) => [v.id, i]));

  const adjA: boolean[][] = Array.from({ length: vCountA }, () => Array(vCountA).fill(false));
  const adjB: boolean[][] = Array.from({ length: vCountB }, () => Array(vCountB).fill(false));

  graphA.edges.forEach((e) => {
    const u = idAtoIdx.get(e.source)!;
    const v = idAtoIdx.get(e.target)!;
    adjA[u][v] = true;
    if (!graphA.directed) adjA[v][u] = true;
  });

  graphB.edges.forEach((e) => {
    const u = idBtoIdx.get(e.source)!;
    const v = idBtoIdx.get(e.target)!;
    adjB[u][v] = true;
    if (!graphB.directed) adjB[v][u] = true;
  });

  const degInfoA = degA.map((d) => ({ in: d.inDegree, out: d.outDegree, total: d.degree }));
  const degInfoB = degB.map((d) => ({ in: d.inDegree, out: d.outDegree, total: d.degree }));

  const mappingAtoB: number[] = Array(vCountA).fill(-1);
  const usedB: boolean[] = Array(vCountB).fill(false);

  let opCount = 0;
  const MAX_PERM_OPS = 200000;

  function findBijection(idxA: number): boolean {
    opCount++;
    if (opCount > MAX_PERM_OPS) return false;

    if (idxA === vCountA) {
      return true;
    }

    const da = degInfoA[idxA];

    for (let idxB = 0; idxB < vCountB; idxB++) {
      if (usedB[idxB]) continue;

      const db = degInfoB[idxB];
      if (da.in !== db.in || da.out !== db.out || da.total !== db.total) {
        continue;
      }

      let consistent = true;
      for (let prevA = 0; prevA < idxA; prevA++) {
        const prevB = mappingAtoB[prevA];
        if (adjA[prevA][idxA] !== adjB[prevB][idxB]) {
          consistent = false;
          break;
        }
        if (adjA[idxA][prevA] !== adjB[idxB][prevB]) {
          consistent = false;
          break;
        }
      }

      if (consistent) {
        mappingAtoB[idxA] = idxB;
        usedB[idxB] = true;

        if (findBijection(idxA + 1)) {
          return true;
        }

        usedB[idxB] = false;
        mappingAtoB[idxA] = -1;
      }
    }

    return false;
  }

  const isIsomorphic = findBijection(0);

  if (isIsomorphic) {
    const vertexMapping: Record<string, string> = {};
    const vertexMappingLabels: Record<string, string> = {};

    vA.forEach((nodeA, i) => {
      const nodeB = vB[mappingAtoB[i]];
      vertexMapping[nodeA.id] = nodeB.id;
      vertexMappingLabels[nodeA.label] = nodeB.label;
    });

    const mappingStr = Object.entries(vertexMappingLabels)
      .map(([a, b]) => `${a} → ${b}`)
      .join(", ");

    steps.push(`✓ Found edge-preserving bijection: ${mappingStr}`);

    return {
      isIsomorphic: true,
      reason: `Isomorphic! Both graphs have identical underlying graph structures under the bijection: ${mappingStr}.`,
      invariantsMatch: true,
      vertexMapping,
      vertexMappingLabels,
      stepsSummary: steps,
    };
  } else {
    const reason =
      "Not Isomorphic: Although preliminary degree invariants match, no edge-preserving bijection exists between the adjacency structures.";
    steps.push("✕ No valid edge-preserving bijection exists.");
    return {
      isIsomorphic: false,
      reason,
      invariantsMatch: true,
      stepsSummary: steps,
    };
  }
}
