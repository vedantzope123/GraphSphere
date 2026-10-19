import { Graph } from "../types/graph";
import { SOCIAL_GRAPH_A, SOCIAL_GRAPH_B } from "./socialGraphs";
import { WEB_GRAPH } from "./webGraph";
import { CAMPUS_GRAPH } from "./campusGraph";
import { UTILITY_GRAPH } from "./utilityGraph";

export const DEFAULT_STARTER_GRAPH: Graph = {
  id: "default_starter_social",
  name: "Campus Social Starter",
  description: "Introductory directed social network demonstrating in-degree, out-degree and follower connections.",
  directed: true,
  weighted: false,
  category: "social",
  vertices: [
    { id: "v_aarav", label: "Aarav", type: "user", position: [-3.0, 1.2, 0.0] },
    { id: "v_priya", label: "Priya", type: "user", position: [0.0, 2.0, 1.0] },
    { id: "v_rahul", label: "Rahul", type: "user", position: [2.5, 0.8, -1.0] },
    { id: "v_sneha", label: "Sneha", type: "user", position: [-1.0, -1.5, 2.0] },
    { id: "v_aditya", label: "Aditya", type: "user", position: [2.0, -1.2, 1.5] },
  ],
  edges: [
    { id: "ed_1", source: "v_aarav", target: "v_priya", directed: true, type: "follow" },
    { id: "ed_2", source: "v_aarav", target: "v_rahul", directed: true, type: "follow" },
    { id: "ed_3", source: "v_priya", target: "v_rahul", directed: true, type: "follow" },
    { id: "ed_4", source: "v_priya", target: "v_sneha", directed: true, type: "follow" },
    { id: "ed_5", source: "v_rahul", target: "v_aditya", directed: true, type: "follow" },
    { id: "ed_6", source: "v_aditya", target: "v_sneha", directed: true, type: "follow" },
  ],
};

export const GRAPH_K4: Graph = {
  id: "math_k4",
  name: "Complete Graph K4",
  description: "Complete graph with 4 vertices and 6 edges. Regular of degree 3, strictly planar.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "k4_a", label: "A", position: [0, 2.5, 0] },
    { id: "k4_b", label: "B", position: [-2.2, -1.0, 1.5] },
    { id: "k4_c", label: "C", position: [2.2, -1.0, 1.5] },
    { id: "k4_d", label: "D", position: [0, -1.0, -2.5] },
  ],
  edges: [
    { id: "ek4_1", source: "k4_a", target: "k4_b", directed: false },
    { id: "ek4_2", source: "k4_a", target: "k4_c", directed: false },
    { id: "ek4_3", source: "k4_a", target: "k4_d", directed: false },
    { id: "ek4_4", source: "k4_b", target: "k4_c", directed: false },
    { id: "ek4_5", source: "k4_b", target: "k4_d", directed: false },
    { id: "ek4_6", source: "k4_c", target: "k4_d", directed: false },
  ],
};

export const GRAPH_K5: Graph = {
  id: "math_k5",
  name: "Complete Graph K5 (Non-Planar)",
  description: "Complete graph with 5 vertices and 10 edges. 4-regular. Classic Kuratowski non-planar minor.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [0, 1, 2, 3, 4].map((i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return {
      id: `k5_${i}`,
      label: String.fromCharCode(65 + i),
      position: [Number((Math.cos(angle) * 3.2).toFixed(2)), Number((Math.sin(angle) * 3.2).toFixed(2)), 0] as [number, number, number],
    };
  }),
  edges: [
    { id: "ek5_1", source: "k5_0", target: "k5_1", directed: false },
    { id: "ek5_2", source: "k5_0", target: "k5_2", directed: false },
    { id: "ek5_3", source: "k5_0", target: "k5_3", directed: false },
    { id: "ek5_4", source: "k5_0", target: "k5_4", directed: false },
    { id: "ek5_5", source: "k5_1", target: "k5_2", directed: false },
    { id: "ek5_6", source: "k5_1", target: "k5_3", directed: false },
    { id: "ek5_7", source: "k5_1", target: "k5_4", directed: false },
    { id: "ek5_8", source: "k5_2", target: "k5_3", directed: false },
    { id: "ek5_9", source: "k5_2", target: "k5_4", directed: false },
    { id: "ek5_10", source: "k5_3", target: "k5_4", directed: false },
  ],
};

export const GRAPH_C5: Graph = {
  id: "math_c5",
  name: "Cycle Graph C5",
  description: "2-regular closed cycle with 5 vertices and 5 edges. Planar, Hamiltonian.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [0, 1, 2, 3, 4].map((i) => {
    const angle = (i * 2 * Math.PI) / 5;
    return {
      id: `c5_${i}`,
      label: `v${i + 1}`,
      position: [Number((Math.cos(angle) * 3.0).toFixed(2)), 0, Number((Math.sin(angle) * 3.0).toFixed(2))] as [number, number, number],
    };
  }),
  edges: [
    { id: "ec5_1", source: "c5_0", target: "c5_1", directed: false },
    { id: "ec5_2", source: "c5_1", target: "c5_2", directed: false },
    { id: "ec5_3", source: "c5_2", target: "c5_3", directed: false },
    { id: "ec5_4", source: "c5_3", target: "c5_4", directed: false },
    { id: "ec5_5", source: "c5_4", target: "c5_0", directed: false },
  ],
};

export const GRAPH_P5: Graph = {
  id: "math_p5",
  name: "Path Graph P5",
  description: "Simple path graph of 5 vertices connected linearly. Acyclic tree with 2 leaves.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "p5_1", label: "A", position: [-4, 0, 0] },
    { id: "p5_2", label: "B", position: [-2, 0.5, 0] },
    { id: "p5_3", label: "C", position: [0, 0, 0] },
    { id: "p5_4", label: "D", position: [2, -0.5, 0] },
    { id: "p5_5", label: "E", position: [4, 0, 0] },
  ],
  edges: [
    { id: "ep_1", source: "p5_1", target: "p5_2", directed: false },
    { id: "ep_2", source: "p5_2", target: "p5_3", directed: false },
    { id: "ep_3", source: "p5_3", target: "p5_4", directed: false },
    { id: "ep_4", source: "p5_4", target: "p5_5", directed: false },
  ],
};

export const GRAPH_STAR: Graph = {
  id: "math_star",
  name: "Star Graph S6 (K1,5)",
  description: "Complete bipartite tree with 1 hub vertex and 5 leaves. Maximum degree = 5, diameter = 2.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "s_hub", label: "Hub", position: [0, 0, 0] },
    ...[0, 1, 2, 3, 4].map((i) => {
      const angle = (i * 2 * Math.PI) / 5;
      return {
        id: `s_leaf_${i}`,
        label: `L${i + 1}`,
        position: [Number((Math.cos(angle) * 3.5).toFixed(2)), 0, Number((Math.sin(angle) * 3.5).toFixed(2))] as [number, number, number],
      };
    }),
  ],
  edges: [0, 1, 2, 3, 4].map((i) => ({
    id: `es_${i}`,
    source: "s_hub",
    target: `s_leaf_${i}`,
    directed: false,
  })),
};

export const GRAPH_TREE: Graph = {
  id: "math_tree",
  name: "Hierarchical Binary Tree",
  description: "Connected acyclic graph with 7 vertices and 6 edges (E = V - 1). 2-colorable and planar.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "t_root", label: "Root", position: [0, 2.5, 0] },
    { id: "t_l1", label: "Left", position: [-2.5, 0.8, 0] },
    { id: "t_r1", label: "Right", position: [2.5, 0.8, 0] },
    { id: "t_l1_l2", label: "LL", position: [-3.8, -1.2, 0] },
    { id: "t_l1_r2", label: "LR", position: [-1.4, -1.2, 0] },
    { id: "t_r1_l2", label: "RL", position: [1.4, -1.2, 0] },
    { id: "t_r1_r2", label: "RR", position: [3.8, -1.2, 0] },
  ],
  edges: [
    { id: "et_1", source: "t_root", target: "t_l1", directed: false },
    { id: "et_2", source: "t_root", target: "t_r1", directed: false },
    { id: "et_3", source: "t_l1", target: "t_l1_l2", directed: false },
    { id: "et_4", source: "t_l1", target: "t_l1_r2", directed: false },
    { id: "et_5", source: "t_r1", target: "t_r1_l2", directed: false },
    { id: "et_6", source: "t_r1", target: "t_r1_r2", directed: false },
  ],
};

export const GRAPH_EULER_PATH: Graph = {
  id: "math_euler_envelope",
  name: "Eulerian Envelope (Euler Path)",
  description: "Famous open-envelope graph with exactly 2 vertices of odd degree, allowing an Euler Path.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "e_bottom_l", label: "A", position: [-2.5, -2.0, 0] },
    { id: "e_bottom_r", label: "B", position: [2.5, -2.0, 0] },
    { id: "e_top_l", label: "C", position: [-2.5, 0.8, 0] },
    { id: "e_top_r", label: "D", position: [2.5, 0.8, 0] },
    { id: "e_apex", label: "Roof", position: [0.0, 2.8, 0] },
  ],
  edges: [
    { id: "ee_1", source: "e_bottom_l", target: "e_bottom_r", directed: false },
    { id: "ee_2", source: "e_bottom_l", target: "e_top_l", directed: false },
    { id: "ee_3", source: "e_bottom_r", target: "e_top_r", directed: false },
    { id: "ee_4", source: "e_top_l", target: "e_top_r", directed: false },
    { id: "ee_5", source: "e_top_l", target: "e_apex", directed: false },
    { id: "ee_6", source: "e_top_r", target: "e_apex", directed: false },
    { id: "ee_7", source: "e_bottom_l", target: "e_top_r", directed: false },
    { id: "ee_8", source: "e_bottom_r", target: "e_top_l", directed: false },
  ],
};

export const GRAPH_EULER_CIRCUIT: Graph = {
  id: "math_euler_circuit",
  name: "Eulerian Circuit Graph",
  description: "Graph where every vertex has degree 2 or 4 (0 odd vertices), having an Euler Circuit.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "ec_center", label: "Center", position: [0, 0, 0] },
    { id: "ec_tl", label: "Top-Left", position: [-2.5, 2.0, 0] },
    { id: "ec_tr", label: "Top-Right", position: [2.5, 2.0, 0] },
    { id: "ec_bl", label: "Bottom-Left", position: [-2.5, -2.0, 0] },
    { id: "ec_br", label: "Bottom-Right", position: [2.5, -2.0, 0] },
  ],
  edges: [
    { id: "eec_1", source: "ec_center", target: "ec_tl", directed: false },
    { id: "eec_2", source: "ec_tl", target: "ec_tr", directed: false },
    { id: "eec_3", source: "ec_tr", target: "ec_center", directed: false },
    { id: "eec_4", source: "ec_center", target: "ec_bl", directed: false },
    { id: "eec_5", source: "ec_bl", target: "ec_br", directed: false },
    { id: "eec_6", source: "ec_br", target: "ec_center", directed: false },
  ],
};

export const GRAPH_ISO_A: Graph = {
  id: "math_iso_a",
  name: "Isomorphism Reference A",
  description: "A 4-vertex diamond graph with vertices A, B, C, D arranged in a planar diamond layout.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "ia_a", label: "A", position: [0, 2.5, 0] },
    { id: "ia_b", label: "B", position: [-2.5, 0, 0] },
    { id: "ia_c", label: "C", position: [2.5, 0, 0] },
    { id: "ia_d", label: "D", position: [0, -2.5, 0] },
  ],
  edges: [
    { id: "eia_1", source: "ia_a", target: "ia_b", directed: false },
    { id: "eia_2", source: "ia_a", target: "ia_c", directed: false },
    { id: "ia_3", source: "ia_b", target: "ia_d", directed: false },
    { id: "ia_4", source: "ia_c", target: "ia_d", directed: false },
    { id: "ia_5", source: "ia_b", target: "ia_c", directed: false },
  ],
};

export const GRAPH_ISO_B: Graph = {
  id: "math_iso_b",
  name: "Isomorphism Target B (≅ A)",
  description: "Structurally isomorphic to Reference A, with permuted labels (1, 2, 3, 4) and rotated spatial coordinates.",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "ib_1", label: "1 (corr. D)", position: [-2.0, 1.8, 1.2] },
    { id: "ib_2", label: "2 (corr. B)", position: [0.0, -2.2, -1.0] },
    { id: "ib_3", label: "3 (corr. C)", position: [2.2, 1.0, -1.5] },
    { id: "ib_4", label: "4 (corr. A)", position: [0.5, 2.5, 1.8] },
  ],
  edges: [
    { id: "eib_1", source: "ib_4", target: "ib_2", directed: false },
    { id: "eib_2", source: "ib_4", target: "ib_3", directed: false },
    { id: "eib_3", source: "ib_2", target: "ib_1", directed: false },
    { id: "eib_4", source: "ib_3", target: "ib_1", directed: false },
    { id: "eib_5", source: "ib_2", target: "ib_3", directed: false },
  ],
};

export const GRAPH_NON_ISO_TRIANGLES: Graph = {
  id: "math_two_triangles",
  name: "Disjoint Triangles (2xK3)",
  description: "6 vertices with degree sequence [2, 2, 2, 2, 2, 2], but disconnected into two 3-cycles (differs from C6).",
  directed: false,
  weighted: false,
  category: "math",
  vertices: [
    { id: "t1_a", label: "A1", position: [-3, 1.5, 0] },
    { id: "t1_b", label: "B1", position: [-4.2, -1, 0] },
    { id: "t1_c", label: "C1", position: [-1.8, -1, 0] },
    { id: "t2_a", label: "A2", position: [3, 1.5, 0] },
    { id: "t2_b", label: "B2", position: [1.8, -1, 0] },
    { id: "t2_c", label: "C2", position: [4.2, -1, 0] },
  ],
  edges: [
    { id: "ett_1", source: "t1_a", target: "t1_b", directed: false },
    { id: "ett_2", source: "t1_b", target: "t1_c", directed: false },
    { id: "ett_3", source: "t1_c", target: "t1_a", directed: false },
    { id: "ett_4", source: "t2_a", target: "t2_b", directed: false },
    { id: "ett_5", source: "t2_b", target: "t2_c", directed: false },
    { id: "ett_6", source: "t2_c", target: "t2_a", directed: false },
  ],
};

export const ALL_PRESET_GRAPHS: Graph[] = [
  DEFAULT_STARTER_GRAPH,
  SOCIAL_GRAPH_A,
  SOCIAL_GRAPH_B,
  WEB_GRAPH,
  CAMPUS_GRAPH,
  UTILITY_GRAPH,
  GRAPH_K4,
  GRAPH_K5,
  GRAPH_C5,
  GRAPH_P5,
  GRAPH_STAR,
  GRAPH_TREE,
  GRAPH_EULER_PATH,
  GRAPH_EULER_CIRCUIT,
  GRAPH_ISO_A,
  GRAPH_ISO_B,
  GRAPH_NON_ISO_TRIANGLES,
];
