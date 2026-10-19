import React from "react";
import { BookOpen, ShieldCheck, Scale, Cpu, Network, CheckCircle2 } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Title */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0B1220] to-[#111827] border border-[#1E293B] space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-semibold border border-[#38BDF8]/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Specification</span>
        </div>
        <h1 className="text-3xl font-black text-[#F8FAFC]">
          GraphSphere 3D — Theory & Methodology
        </h1>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          GraphSphere 3D is an interactive discrete mathematics platform built for demonstrating
          graph theory concepts through real-world systems, structural comparison, and algorithm simulation.
        </p>
      </div>

      {/* Core Architectural Tenet */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-3">
        <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#38BDF8]" />
          Single Reusable Graph Engine Architecture
        </h2>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Rather than building disconnected, hard-coded demos, every real-world template
          (Social Media, Web Graph, Campus Map, Three Utilities) and mathematical preset compiles
          into the canonical graph model:
        </p>
        <pre className="p-3.5 rounded-xl bg-[#050816] border border-[#1E293B] text-xs font-mono text-[#38BDF8] overflow-x-auto">
{`type Vertex = {
  id: string;
  label: string;
  type?: "user" | "location" | "website" | "house" | "utility" | "custom";
  position: [number, number, number];
};

type Edge = {
  id: string;
  source: string;
  target: string;
  directed: boolean;
  weight?: number;
  type?: "follow" | "friend" | "road" | "link" | "utility" | "custom";
};

type Graph = {
  id: string;
  name: string;
  vertices: Vertex[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
};`}
        </pre>
      </div>

      {/* Mathematical Theorems Implemented */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-4">
        <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          Implemented Mathematical Theorems
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0B1220] border border-[#1E293B] space-y-1">
            <span className="font-bold text-[#38BDF8]">1. The Handshaking Lemma</span>
            <p className="text-[#94A3B8] leading-relaxed">
              In an undirected graph, Σ deg(v) = 2|E|. In a directed graph, Σ inDeg(v) = Σ outDeg(v) = |E|.
              This guarantees that the number of vertices with odd degree is always even.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B1220] border border-[#1E293B] space-y-1">
            <span className="font-bold text-[#818CF8]">2. Euler's Planarity Inequality & Kuratowski's Theorem</span>
            <p className="text-[#94A3B8] leading-relaxed">
              For any planar graph with V ≥ 3, E ≤ 3V - 6. For triangle-free (bipartite) planar graphs,
              E ≤ 2V - 4. Complete graph K₅ (E = 10 &gt; 9) and Three Utility graph K₃,₃ (E = 9 &gt; 8)
              violate these conditions and are minimal forbidden topological minors.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B1220] border border-[#1E293B] space-y-1">
            <span className="font-bold text-[#22C55E]">3. Dijkstra's Shortest Path Algorithm</span>
            <p className="text-[#94A3B8] leading-relaxed">
              Computes shortest paths from a source to all other nodes in a weighted graph with
              non-negative weights using priority queue greedy relaxation in O((V + E) log V) time.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B1220] border border-[#1E293B] space-y-1">
            <span className="font-bold text-[#F59E0B]">4. Graph Isomorphism Testing</span>
            <p className="text-[#94A3B8] leading-relaxed">
              Validates necessary invariants (order, size, sorted degree sequence, components) followed
              by degree-pruned permutation backtracking to compute an exact edge-preserving bijection.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0B1220] border border-[#1E293B] space-y-1">
            <span className="font-bold text-[#EC4899]">5. Welsh-Powell Graph Coloring</span>
            <p className="text-[#94A3B8] leading-relaxed">
              Greedy coloring heuristic ordering vertices in descending order of degree.
              Bounded by Brooks' theorem: χ(G) ≤ Δ(G) + 1. Applied to timetable and exam conflict scheduling.
            </p>
          </div>
        </div>
      </div>

      {/* College Success Criteria Checklist */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-3">
        <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          Verification Checklist
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Social media follower network
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> In-degree & out-degree inspection
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Graph Builder in 3D
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Side-by-side graph comparison
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Isomorphism check & mapping
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Adjacency Matrix & List
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Connectivity & components
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Euler & Hamilton traversals
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Three Utility Problem (K₃,₃)
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Web hyperlink graph model
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Campus map with Dijkstra
          </span>
          <span className="flex items-center gap-1.5 text-[#F8FAFC]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Welsh-Powell graph coloring
          </span>
        </div>
      </div>
    </div>
  );
};
