import React from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { ALL_PRESET_GRAPHS } from "../data/graphExamples";
import {
  Users,
  Globe,
  MapPin,
  Home as HomeIcon,
  GitCompare,
  Cpu,
  TableProperties,
  Palette,
  Trophy,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const store = useGraphStore();

  const realWorldCards = [
    {
      tab: "social" as const,
      title: "Social Media Network",
      category: "Directed & In-Degree",
      desc: "15 users, followers as in-degree, following as out-degree, mutual friendships, and influencer metrics.",
      icon: Users,
      color: "from-sky-500/20 to-blue-600/10 border-sky-500/30 text-sky-400",
      badge: "15 Vertices",
    },
    {
      tab: "web" as const,
      title: "The Web Graph",
      category: "Hyperlinks & Authority",
      desc: "Webpages as vertices, hyperlinks as directed edges. Backlink authority and search crawler simulation.",
      icon: Globe,
      color: "from-indigo-500/20 to-purple-600/10 border-indigo-500/30 text-indigo-400",
      badge: "Backlinks",
    },
    {
      tab: "campus" as const,
      title: "Campus Road Map",
      category: "Weighted Shortest Path",
      desc: "Interactive weighted roads between buildings. Dijkstra navigation finding College to Ground (7.0 km).",
      icon: MapPin,
      color: "from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
      badge: "Dijkstra 7km",
    },
    {
      tab: "utility" as const,
      title: "Three Utility Problem",
      category: "K3,3 Kuratowski Planarity",
      desc: "Connect 3 houses to Water, Gas, Electricity. Why it crosses in 2D but untangles in 3D space!",
      icon: HomeIcon,
      color: "from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400",
      badge: "Non-Planar",
    },
  ];

  const analysisTools = [
    {
      tab: "comparison" as const,
      title: "Side-by-Side Dual 3D Comparison",
      desc: "Compare two graphs simultaneously with automated isomorphism testing and structural metrics.",
      icon: GitCompare,
    },
    {
      tab: "matrix" as const,
      title: "Matrix Representations",
      desc: "Live synchronized Adjacency Matrix, Adjacency List, and Edge List with 3D canvas hover highlights.",
      icon: TableProperties,
    },
    {
      tab: "algorithms" as const,
      title: "Algorithms Studio",
      desc: "Step-by-step playback with Play, Pause, Speed and Stack/Queue inspection for Dijkstra, BFS, DFS, Euler & Hamilton.",
      icon: Cpu,
    },
    {
      tab: "coloring" as const,
      title: "Graph Coloring & Scheduling",
      desc: "Welsh-Powell greedy algorithm, chromatic number calculation, and conflict-free Exam Scheduling map.",
      icon: Palette,
    },
    {
      tab: "challenges" as const,
      title: "Interactive Challenges",
      desc: "Gamified graph theory quizzes on Handshaking lemma, bipartite tests, and planarity reasoning.",
      icon: Trophy,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* 3D Hero Viewport Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl">
        <div className="h-[360px] md:h-[440px] w-full">
          <GraphCanvas3D titleBadge="Interactive 3D Viewport" />
        </div>

        {/* Hero Overlay Info */}
        <div className="p-4 md:p-6 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-sky-400">
                ACTIVE GRAPH MODEL
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{store.activeGraph.category || "General"}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {store.activeGraph.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {store.activeGraph.description ||
                "Explore vertices, drag to sculpt positions in 3D space, or select nodes to inspect incidence and degree."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => store.setActiveTab("builder")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              Custom Sculpt
            </button>
            <button
              onClick={() => store.setActiveTab("comparison")}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5"
            >
              <span>Compare Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-World Systems Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Real-World Graph Systems
            </h2>
            <p className="text-xs text-slate-400">
              Concrete application domains bridging pure discrete math with day-to-day engineering.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {realWorldCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.tab}
                onClick={() => store.setActiveTab(card.tab)}
                className={`p-4 rounded-xl border bg-gradient-to-b ${card.color} hover:scale-[1.02] hover:border-sky-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                    {card.title}
                  </h3>
                  <div className="text-[11px] font-mono text-sky-400 mb-2">{card.category}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                  <span>Launch Exploration</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis & Computational Tools */}
      <div>
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Discrete Mathematics & Analysis Tools
        </h2>
        <p className="text-xs text-slate-400 mb-3">
          Explore theoretical proofs, representations, algorithmic walks, and comparative topology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysisTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.tab}
                onClick={() => store.setActiveTab(tool.tab)}
                className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-950/60 group-hover:border-indigo-500/40 transition-colors">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
