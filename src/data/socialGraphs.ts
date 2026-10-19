import { Graph, Vertex } from "../types/graph";

export interface UserMetadata {
  handle: string;
  role: string;
  bio: string;
}

export const SAMPLE_USERS: { id: string; name: string; handle: string; role: string; bio: string }[] = [
  { id: "u_aarav", name: "Aarav", handle: "@aarav_codes", role: "CS Major & Dev", bio: "Building graph algorithms & AI projects." },
  { id: "u_priya", name: "Priya", handle: "@priya_tech", role: "Tech Lead & Creator", bio: "Open source advocate & campus tech lead." },
  { id: "u_rahul", name: "Rahul", handle: "@rahul_ai", role: "Data Science Student", bio: "Exploring network science & graph theory." },
  { id: "u_sneha", name: "Sneha", handle: "@sneha_ui", role: "Design & UX lead", bio: "Design systems and 3D visual computing." },
  { id: "u_aditya", name: "Aditya", handle: "@aditya_sys", role: "Systems Engineer", bio: "Distributed nodes & high throughput streams." },
  { id: "u_riya", name: "Riya", handle: "@riya_math", role: "Math Researcher", bio: "Combinatorics, graph spectrums & topology." },
  { id: "u_kabir", name: "Kabir", handle: "@kabir_sec", role: "Cybersecurity Club", bio: "Network security and cryptographic protocols." },
  { id: "u_ananya", name: "Ananya", handle: "@ananya_ml", role: "ML Researcher", bio: "Graph Neural Networks & embeddings." },
  { id: "u_om", name: "Om", handle: "@om_builder", role: "Robotics Lead", bio: "Autonomous navigation & pathfinding." },
  { id: "u_isha", name: "Isha", handle: "@isha_web", role: "Web Architect", bio: "Hypermedia and decentralized graphs." },
  { id: "u_ved", name: "Ved", handle: "@ved_z", role: "Project Creator", bio: "Discrete mathematics project author." },
  { id: "u_neha", name: "Neha", handle: "@neha_algo", role: "Competitive Programmer", bio: "Dijkstra, DFS/BFS and Euler paths." },
  { id: "u_arjun", name: "Arjun", handle: "@arjun_k", role: "Cloud Architect", bio: "Serverless architectures & infrastructure." },
  { id: "u_tanvi", name: "Tanvi", handle: "@tanvi_ds", role: "Data Analyst", bio: "Visualizing social clusters & influence metrics." },
  { id: "u_rohan", name: "Rohan", handle: "@rohan_v", role: "Game Developer", bio: "Procedural geometry & 3D space." },
];

function generateCirclePositions(count: number, radius = 5.2): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count;
    const yVariation = Math.sin(i * 1.3) * 1.2;
    positions.push([
      Number((Math.cos(angle) * radius).toFixed(2)),
      Number(yVariation.toFixed(2)),
      Number((Math.sin(angle) * radius).toFixed(2)),
    ]);
  }
  return positions;
}

const positionsA = generateCirclePositions(15, 5.2);

export const SOCIAL_GRAPH_A: Graph = {
  id: "social_graph_a",
  name: "Campus Social Network A",
  description: "Primary directed social media follower graph of 15 campus users.",
  directed: true,
  weighted: false,
  category: "social",
  vertices: SAMPLE_USERS.map((u, i) => ({
    id: u.id,
    label: u.name,
    type: "user" as const,
    position: positionsA[i],
    metadata: {
      handle: u.handle,
      role: u.role,
      bio: u.bio,
    },
  })),
  edges: [
    { id: "e_s_1", source: "u_aarav", target: "u_priya", directed: true, type: "follow" },
    { id: "e_s_2", source: "u_aarav", target: "u_rahul", directed: true, type: "follow" },
    { id: "e_s_3", source: "u_aarav", target: "u_sneha", directed: true, type: "follow" },
    { id: "e_s_4", source: "u_aarav", target: "u_aditya", directed: true, type: "follow" },
    { id: "e_s_5", source: "u_priya", target: "u_sneha", directed: true, type: "follow" },
    { id: "e_s_6", source: "u_priya", target: "u_rahul", directed: true, type: "follow" },
    { id: "e_s_7", source: "u_priya", target: "u_riya", directed: true, type: "follow" },
    { id: "e_s_8", source: "u_rahul", target: "u_priya", directed: true, type: "follow" },
    { id: "e_s_9", source: "u_sneha", target: "u_priya", directed: true, type: "follow" },
    { id: "e_s_10", source: "u_aditya", target: "u_priya", directed: true, type: "follow" },
    { id: "e_s_11", source: "u_riya", target: "u_priya", directed: true, type: "follow" },
    { id: "e_s_12", source: "u_ananya", target: "u_priya", directed: true, type: "follow" },
    { id: "e_s_13", source: "u_rahul", target: "u_aditya", directed: true, type: "follow" },
    { id: "e_s_14", source: "u_rahul", target: "u_ananya", directed: true, type: "follow" },
    { id: "e_s_15", source: "u_aditya", target: "u_riya", directed: true, type: "follow" },
    { id: "e_s_16", source: "u_aditya", target: "u_sneha", directed: true, type: "follow" },
    { id: "e_s_17", source: "u_sneha", target: "u_isha", directed: true, type: "follow" },
    { id: "e_s_18", source: "u_sneha", target: "u_tanvi", directed: true, type: "follow" },
    { id: "e_s_19", source: "u_kabir", target: "u_priya", directed: true, type: "follow" },
    { id: "e_s_20", source: "u_kabir", target: "u_arjun", directed: true, type: "follow" },
    { id: "e_s_21", source: "u_kabir", target: "u_aditya", directed: true, type: "follow" },
    { id: "e_s_22", source: "u_ananya", target: "u_ved", directed: true, type: "follow" },
    { id: "e_s_23", source: "u_ananya", target: "u_neha", directed: true, type: "follow" },
    { id: "e_s_24", source: "u_om", target: "u_rohan", directed: true, type: "follow" },
    { id: "e_s_25", source: "u_om", target: "u_ved", directed: true, type: "follow" },
    { id: "e_s_26", source: "u_ved", target: "u_aarav", directed: true, type: "follow" },
    { id: "e_s_27", source: "u_neha", target: "u_rahul", directed: true, type: "follow" },
    { id: "e_s_28", source: "u_arjun", target: "u_tanvi", directed: true, type: "follow" },
  ],
};

export const SOCIAL_GRAPH_B: Graph = {
  id: "social_graph_b",
  name: "Campus Social Network B (34 Edges)",
  description: "Alternative social follower network with higher clustering and 34 relationships.",
  directed: true,
  weighted: false,
  category: "social",
  vertices: SAMPLE_USERS.map((u, i) => ({
    id: u.id,
    label: u.name,
    type: "user" as const,
    position: positionsA[i],
    metadata: {
      handle: u.handle,
      role: u.role,
      bio: u.bio,
    },
  })),
  edges: [
    ...SOCIAL_GRAPH_A.edges,
    { id: "e_sb_29", source: "u_tanvi", target: "u_priya", directed: true, type: "follow" },
    { id: "e_sb_30", source: "u_rohan", target: "u_aarav", directed: true, type: "follow" },
    { id: "e_sb_31", source: "u_isha", target: "u_aarav", directed: true, type: "follow" },
    { id: "e_sb_32", source: "u_riya", target: "u_ved", directed: true, type: "follow" },
    { id: "e_sb_33", source: "u_neha", target: "u_aditya", directed: true, type: "follow" },
    { id: "e_sb_34", source: "u_arjun", target: "u_priya", directed: true, type: "follow" },
  ],
};
