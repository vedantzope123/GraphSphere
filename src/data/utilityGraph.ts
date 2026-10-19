import { Graph } from "../types/graph";

export const UTILITY_GRAPH: Graph = {
  id: "utility_k33_primary",
  name: "Three Utility Problem (K3,3)",
  description: "Classic complete bipartite graph K3,3 connecting 3 houses to 3 utilities (Water, Electricity, Gas), demonstrating non-planarity.",
  directed: false,
  weighted: false,
  category: "utility",
  vertices: [
    { id: "h_a", label: "House A", type: "house", position: [-3.5, 0.8, -1.8], color: "#38BDF8", metadata: { occupant: "Resident A", category: "Residential" } },
    { id: "h_b", label: "House B", type: "house", position: [0.0, 0.8, -1.8], color: "#38BDF8", metadata: { occupant: "Resident B", category: "Residential" } },
    { id: "h_c", label: "House C", type: "house", position: [3.5, 0.8, -1.8], color: "#38BDF8", metadata: { occupant: "Resident C", category: "Residential" } },
    { id: "u_water", label: "Water", type: "utility", position: [-3.5, -0.8, 1.8], color: "#06B6D4", metadata: { facility: "Water Supply Plant", category: "Municipal Utility" } },
    { id: "u_electric", label: "Electricity", type: "utility", position: [0.0, -0.8, 1.8], color: "#F59E0B", metadata: { facility: "Power Grid Substation", category: "Municipal Utility" } },
    { id: "u_gas", label: "Gas", type: "utility", position: [3.5, -0.8, 1.8], color: "#EF4444", metadata: { facility: "Natural Gas Station", category: "Municipal Utility" } },
  ],
  edges: [
    { id: "eu_1", source: "h_a", target: "u_water", directed: false, type: "utility", label: "Water Pipe" },
    { id: "eu_2", source: "h_a", target: "u_electric", directed: false, type: "utility", label: "Power Line" },
    { id: "eu_3", source: "h_a", target: "u_gas", directed: false, type: "utility", label: "Gas Line" },
    { id: "eu_4", source: "h_b", target: "u_water", directed: false, type: "utility", label: "Water Pipe" },
    { id: "eu_5", source: "h_b", target: "u_electric", directed: false, type: "utility", label: "Power Line" },
    { id: "eu_6", source: "h_b", target: "u_gas", directed: false, type: "utility", label: "Gas Line" },
    { id: "eu_7", source: "h_c", target: "u_water", directed: false, type: "utility", label: "Water Pipe" },
    { id: "eu_8", source: "h_c", target: "u_electric", directed: false, type: "utility", label: "Power Line" },
    { id: "eu_9", source: "h_c", target: "u_gas", directed: false, type: "utility", label: "Gas Line" },
  ],
};
