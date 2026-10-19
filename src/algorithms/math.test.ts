import test from "node:test";
import assert from "node:assert/strict";

import { verifyHandshakingLemma, calculateAverageDegree } from "../utils/degreeUtils.ts";
import { analyzeConnectivity } from "./connectivity.ts";
import { runDijkstra } from "./dijkstra.ts";
import { analyzeEuler } from "./euler.ts";
import { analyzeHamiltonian } from "./hamiltonian.ts";
import { checkIsomorphism } from "./isomorphism.ts";
import { checkPlanarity } from "./planarity.ts";
import { colorGraphWelshPowell } from "./coloring.ts";

import { CAMPUS_GRAPH } from "../data/campusGraph.ts";
import { UTILITY_GRAPH } from "../data/utilityGraph.ts";
import { GRAPH_K4, GRAPH_K5, GRAPH_ISO_A, GRAPH_ISO_B, GRAPH_C5 } from "../data/graphExamples.ts";

test("Campus Dijkstra shortest path: College to Ground should be 7.0km", () => {
  const result = runDijkstra(CAMPUS_GRAPH, "c_college", "c_ground");
  assert.equal(result.isReachable, true);
  assert.equal(result.totalDistance, 7.0);
  assert.deepEqual(result.path, ["c_college", "c_hostel", "c_ground"]);
});

test("Handshaking lemma on K4 undirected: sum of degrees = 2 * edges", () => {
  const verification = verifyHandshakingLemma(GRAPH_K4);
  assert.equal(verification.isSatisfied, true);
  assert.equal(verification.sumDegree, 12);
  assert.equal(verification.numEdges, 6);
  assert.equal(verification.twoTimesEdges, 12);
});

test("Utility Graph K3,3 is non-planar bipartite", () => {
  const conn = analyzeConnectivity(UTILITY_GRAPH);
  assert.equal(conn.isBipartite, true);
  const planarity = checkPlanarity(UTILITY_GRAPH);
  assert.equal(planarity.isPlanar, false);
});

test("K4 is planar and K5 is non-planar", () => {
  const pK4 = checkPlanarity(GRAPH_K4);
  assert.equal(pK4.isPlanar, true);

  const pK5 = checkPlanarity(GRAPH_K5);
  assert.equal(pK5.isPlanar, false);
});

test("Graph Isomorphism: ISO_A and ISO_B are isomorphic", () => {
  const isoResult = checkIsomorphism(GRAPH_ISO_A, GRAPH_ISO_B);
  assert.equal(isoResult.isIsomorphic, true);
  assert.ok(isoResult.vertexMapping);
});

test("Cycle graph C5 has Euler circuit", () => {
  const euler = analyzeEuler(GRAPH_C5);
  assert.equal(euler.hasEulerCircuit, true);
  assert.equal(euler.oddDegreeVertices.length, 0);
});

test("Graph coloring assigns non-conflicting colors to K4 (needs 4 colors)", () => {
  const colorResult = colorGraphWelshPowell(GRAPH_K4);
  assert.equal(colorResult.isProperColoring, true);
  assert.equal(colorResult.colorsUsed, 4);
});
