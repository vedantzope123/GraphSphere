import { Graph } from "../types/graph";

export const CAMPUS_GRAPH: Graph = {
  id: "campus_map_primary",
  name: "Campus Road Map (Weighted)",
  description: "Weighted road network connecting academic buildings and campus facilities for shortest route navigation.",
  directed: false,
  weighted: true,
  category: "campus",
  vertices: [
    { id: "c_college", label: "College Main", type: "location", position: [-3.5, 0.4, -2.5], metadata: { building: "Admin & Academic Block", code: "ADM" } },
    { id: "c_library", label: "Library", type: "location", position: [-0.5, 0.2, -3.5], metadata: { building: "Central Library", code: "LIB" } },
    { id: "c_hostel", label: "Hostel", type: "location", position: [-2.8, -0.2, 1.8], metadata: { building: "Student Residences", code: "HST" } },
    { id: "c_canteen", label: "Canteen", type: "location", position: [2.5, 0.5, -2.0], metadata: { building: "Food Court & Dining", code: "CAN" } },
    { id: "c_lab", label: "Laboratory", type: "location", position: [-5.0, 0.0, 0.5], metadata: { building: "Science & Compute Labs", code: "LAB" } },
    { id: "c_ground", label: "Ground", type: "location", position: [1.2, -0.4, 2.8], metadata: { building: "Sports Complex & Track", code: "SPO" } },
    { id: "c_parking", label: "Parking", type: "location", position: [4.2, -0.2, 1.5], metadata: { building: "North Parking Lot", code: "PRK" } },
    { id: "c_gate", label: "Main Gate", type: "location", position: [3.8, 0.8, -0.5], metadata: { building: "Campus Main Entrance", code: "GAT" } },
  ],
  edges: [
    { id: "ec_1", source: "c_college", target: "c_library", directed: false, weight: 2, type: "road", label: "2 km" },
    { id: "ec_2", source: "c_college", target: "c_hostel", directed: false, weight: 5, type: "road", label: "5 km" },
    { id: "ec_3", source: "c_library", target: "c_canteen", directed: false, weight: 3, type: "road", label: "3 km" },
    { id: "ec_4", source: "c_canteen", target: "c_ground", directed: false, weight: 4, type: "road", label: "4 km" },
    { id: "ec_5", source: "c_hostel", target: "c_ground", directed: false, weight: 2, type: "road", label: "2 km" },
    { id: "ec_6", source: "c_ground", target: "c_parking", directed: false, weight: 3, type: "road", label: "3 km" },
    { id: "ec_7", source: "c_parking", target: "c_gate", directed: false, weight: 2, type: "road", label: "2 km" },
    { id: "ec_8", source: "c_gate", target: "c_college", directed: false, weight: 6, type: "road", label: "6 km" },
    { id: "ec_9", source: "c_lab", target: "c_college", directed: false, weight: 3, type: "road", label: "3 km" },
    { id: "ec_10", source: "c_lab", target: "c_hostel", directed: false, weight: 4, type: "road", label: "4 km" },
  ],
};
