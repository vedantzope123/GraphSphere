import { Graph, ComparisonResult } from "../types/graph";
import { calculateGraphStats } from "./graphUtils";
import { checkIsomorphism } from "../algorithms/isomorphism";
import { getDegreeSequence, getInDegreeSequence, getOutDegreeSequence } from "./degreeUtils";

export function compareGraphs(graphA: Graph, graphB: Graph): ComparisonResult {
  const statsA = calculateGraphStats(graphA);
  const statsB = calculateGraphStats(graphB);
  const isoResult = checkIsomorphism(graphA, graphB);

  const degSeqA = getDegreeSequence(graphA).join(", ");
  const degSeqB = getDegreeSequence(graphB).join(", ");

  const inSeqA = graphA.directed ? getInDegreeSequence(graphA).join(", ") : "—";
  const inSeqB = graphB.directed ? getInDegreeSequence(graphB).join(", ") : "—";

  const outSeqA = graphA.directed ? getOutDegreeSequence(graphA).join(", ") : "—";
  const outSeqB = graphB.directed ? getOutDegreeSequence(graphB).join(", ") : "—";

  const rows: ComparisonResult["comparisonRows"] = [
    // Basic
    {
      category: "Basic",
      feature: "Vertices |V|",
      valA: String(statsA.vertexCount),
      valB: String(statsB.vertexCount),
      status: statsA.vertexCount === statsB.vertexCount ? "same" : "different",
    },
    {
      category: "Basic",
      feature: "Edges |E|",
      valA: String(statsA.edgeCount),
      valB: String(statsB.edgeCount),
      status: statsA.edgeCount === statsB.edgeCount ? "same" : "different",
    },
    {
      category: "Basic",
      feature: "Graph Type",
      valA: graphA.directed ? "Directed" : "Undirected",
      valB: graphB.directed ? "Directed" : "Undirected",
      status: graphA.directed === graphB.directed ? "same" : "different",
    },
    {
      category: "Basic",
      feature: "Edge Weights",
      valA: graphA.weighted ? "Weighted" : "Unweighted",
      valB: graphB.weighted ? "Weighted" : "Unweighted",
      status: graphA.weighted === graphB.weighted ? "same" : "different",
    },

    // Structural
    {
      category: "Structural",
      feature: "Degree Sequence",
      valA: `[${degSeqA}]`,
      valB: `[${degSeqB}]`,
      status: degSeqA === degSeqB ? "same" : "different",
    },
    {
      category: "Structural",
      feature: "In-Degree Sequence",
      valA: graphA.directed ? `[${inSeqA}]` : "N/A (Undirected)",
      valB: graphB.directed ? `[${inSeqB}]` : "N/A (Undirected)",
      status: graphA.directed && graphB.directed ? (inSeqA === inSeqB ? "same" : "different") : "na",
    },
    {
      category: "Structural",
      feature: "Out-Degree Sequence",
      valA: graphA.directed ? `[${outSeqA}]` : "N/A (Undirected)",
      valB: graphB.directed ? `[${outSeqB}]` : "N/A (Undirected)",
      status: graphA.directed && graphB.directed ? (outSeqA === outSeqB ? "same" : "different") : "na",
    },
    {
      category: "Structural",
      feature: "Connected Components",
      valA: `${statsA.componentCount} component(s)`,
      valB: `${statsB.componentCount} component(s)`,
      status: statsA.componentCount === statsB.componentCount ? "same" : "different",
    },
    {
      category: "Structural",
      feature: "Density",
      valA: String(statsA.density),
      valB: String(statsB.density),
      status: statsA.density === statsB.density ? "same" : "different",
    },

    // Properties
    {
      category: "Properties",
      feature: "Connected Status",
      valA: statsA.isConnected ? "Connected" : "Disconnected",
      valB: statsB.isConnected ? "Connected" : "Disconnected",
      status: statsA.isConnected === statsB.isConnected ? "same" : "different",
    },
    {
      category: "Properties",
      feature: "Cycles Present",
      valA: statsA.hasCycle ? "Cyclic" : "Acyclic",
      valB: statsB.hasCycle ? "Cyclic" : "Acyclic",
      status: statsA.hasCycle === statsB.hasCycle ? "same" : "different",
    },
    {
      category: "Properties",
      feature: "Regular Graph",
      valA: statsA.isRegular ? `Yes (${statsA.regularDegree}-regular)` : "No",
      valB: statsB.isRegular ? `Yes (${statsB.regularDegree}-regular)` : "No",
      status: statsA.isRegular === statsB.isRegular && statsA.regularDegree === statsB.regularDegree ? "same" : "different",
    },
    {
      category: "Properties",
      feature: "Complete Graph",
      valA: statsA.isComplete ? "Complete" : "Incomplete",
      valB: statsB.isComplete ? "Complete" : "Incomplete",
      status: statsA.isComplete === statsB.isComplete ? "same" : "different",
    },
    {
      category: "Properties",
      feature: "Bipartite",
      valA: statsA.isBipartite ? "Yes (2-Colorable)" : "No (Odd cycle)",
      valB: statsB.isBipartite ? "Yes (2-Colorable)" : "No (Odd cycle)",
      status: statsA.isBipartite === statsB.isBipartite ? "same" : "different",
    },
    {
      category: "Properties",
      feature: "Tree Structure",
      valA: statsA.isTree ? "Yes (Tree)" : "No",
      valB: statsB.isTree ? "Yes (Tree)" : "No",
      status: statsA.isTree === statsB.isTree ? "same" : "different",
    },
    {
      category: "Properties",
      feature: "Planar Status",
      valA: statsA.isPlanar ? "Planar" : "Non-Planar",
      valB: statsB.isPlanar ? "Planar" : "Non-Planar",
      status: statsA.isPlanar === statsB.isPlanar ? "same" : "different",
    },

    // Algorithms
    {
      category: "Algorithms",
      feature: "Euler Traversal",
      valA: statsA.hasEulerCircuit ? "Euler Circuit" : statsA.hasEulerPath ? "Euler Path" : "None",
      valB: statsB.hasEulerCircuit ? "Euler Circuit" : statsB.hasEulerPath ? "Euler Path" : "None",
      status:
        statsA.hasEulerCircuit === statsB.hasEulerCircuit && statsA.hasEulerPath === statsB.hasEulerPath
          ? "same"
          : "different",
    },
    {
      category: "Algorithms",
      feature: "Hamiltonian Traversal",
      valA: statsA.hasHamiltonCircuit ? "Hamilton Circuit" : statsA.hasHamiltonPath ? "Hamilton Path" : "None",
      valB: statsB.hasHamiltonCircuit ? "Hamilton Circuit" : statsB.hasHamiltonPath ? "Hamilton Path" : "None",
      status:
        statsA.hasHamiltonCircuit === statsB.hasHamiltonCircuit && statsA.hasHamiltonPath === statsB.hasHamiltonPath
          ? "same"
          : "different",
    },

    // Isomorphism
    {
      category: "Isomorphism",
      feature: "Graph Isomorphism G_A ≅ G_B",
      valA: isoResult.isIsomorphic ? "Isomorphic (≅)" : "Non-Isomorphic (≇)",
      valB: isoResult.isIsomorphic ? "Isomorphic (≅)" : "Non-Isomorphic (≇)",
      status: isoResult.isIsomorphic ? "same" : "different",
    },
  ];

  let conclusion = "";
  if (isoResult.isIsomorphic) {
    const mapStr = isoResult.vertexMappingLabels
      ? Object.entries(isoResult.vertexMappingLabels)
          .map(([a, b]) => `${a} → ${b}`)
          .slice(0, 5)
          .join(", ")
      : "";
    conclusion = `Graph A and Graph B have identical structural properties: |V| = ${statsA.vertexCount}, |E| = ${
      statsA.edgeCount
    }, and degree sequence [${degSeqA}]. Backtracking verification confirms that an edge-preserving bijection exists (${mapStr}${
      Object.keys(isoResult.vertexMappingLabels || {}).length > 5 ? ", ..." : ""
    }). Therefore, Graph A ≅ Graph B (Isomorphic).`;
  } else if (!isoResult.invariantsMatch) {
    conclusion = `Graph A and Graph B are structurally non-isomorphic (Graph A ≇ Graph B). They fail preliminary graph invariant tests: ${isoResult.reason}.`;
  } else {
    conclusion = `Although Graph A and Graph B share equal basic invariants (|V| = ${statsA.vertexCount}, |E| = ${statsA.edgeCount}, degree sequence), adjacency permutation testing shows no edge-preserving bijection exists. Thus, the two graphs represent structurally distinct topologies (Graph A ≇ Graph B).`;
  }

  return {
    graphA,
    graphB,
    statsA,
    statsB,
    isomorphic: isoResult.isIsomorphic,
    isomorphismReason: isoResult.reason,
    vertexMapping: isoResult.vertexMapping,
    vertexMappingLabels: isoResult.vertexMappingLabels,
    comparisonRows: rows,
    conclusion,
  };
}
