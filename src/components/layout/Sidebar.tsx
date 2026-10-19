import React from "react";
import { useGraphStore, NavTab } from "../../state/graphStore";
import {
  LayoutDashboard,
  Users,
  Globe,
  MapPin,
  Home as HomeIcon,
  GitCompare,
  Wrench,
  TableProperties,
  Cpu,
  Palette,
  Trophy,
  Presentation,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const store = useGraphStore();

  const sections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        {
          id: "dashboard",
          label: "Dashboard & Hub",
          sublabel: "3D Playground & Overview",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "REAL-WORLD SYSTEMS",
      items: [
        {
          id: "social",
          label: "Social Media Network",
          sublabel: "15 Users & Follower Analysis",
          icon: Users,
          badge: "Real-World",
          badgeColor: "bg-sky-950 text-sky-400 border-sky-500/30",
        },
        {
          id: "web",
          label: "Web Graph & Search",
          sublabel: "Hyperlinks & Backlinks",
          icon: Globe,
        },
        {
          id: "campus",
          label: "Campus Road Map",
          sublabel: "Weighted Dijkstra Routes",
          icon: MapPin,
          badge: "7.0 km",
          badgeColor: "bg-emerald-950 text-emerald-400 border-emerald-500/30",
        },
        {
          id: "utility",
          label: "Three Utility Problem",
          sublabel: "K3,3 Kuratowski Planarity",
          icon: HomeIcon,
          badge: "Puzzle",
          badgeColor: "bg-amber-950 text-amber-400 border-amber-500/30",
        },
      ],
    },
    {
      title: "COMPARISON & STRUCTURAL",
      items: [
        {
          id: "comparison",
          label: "Side-by-Side Compare",
          sublabel: "Dual 3D & Isomorphism",
          icon: GitCompare,
          badge: "Dual 3D",
          badgeColor: "bg-purple-950 text-purple-400 border-purple-500/30",
        },
        {
          id: "matrix",
          label: "Matrix Representations",
          sublabel: "Adj Matrix, Lists, Edge Maps",
          icon: TableProperties,
        },
        {
          id: "builder",
          label: "3D Graph Builder",
          sublabel: "Custom Sculpt & Topology",
          icon: Wrench,
        },
      ],
    },
    {
      title: "ALGORITHMS & COMPUTATION",
      items: [
        {
          id: "algorithms",
          label: "Algorithms Studio",
          sublabel: "Dijkstra, BFS, DFS, Euler, Hamilton",
          icon: Cpu,
          badge: "Step-by-Step",
          badgeColor: "bg-indigo-950 text-indigo-400 border-indigo-500/30",
        },
        {
          id: "coloring",
          label: "Graph Coloring & Timetable",
          sublabel: "Welsh-Powell & Scheduling",
          icon: Palette,
        },
      ],
    },
    {
      title: "LEARNING & COLLABORATION",
      items: [
        {
          id: "challenges",
          label: "Challenges & Quizzes",
          sublabel: "Handshaking & Graph Puzzles",
          icon: Trophy,
          badge: "XP",
          badgeColor: "bg-rose-950 text-rose-400 border-rose-500/30",
        },
        {
          id: "presentation",
          label: "Classroom Deck",
          sublabel: "Interactive 3D Slides",
          icon: Presentation,
        },
        {
          id: "theory",
          label: "Theory & Handbook",
          sublabel: "Definitions & Theorems",
          icon: BookOpen,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 bottom-0 left-0 w-72 bg-slate-950 border-r border-slate-800/80 z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((sec, secIdx) => (
            <div key={secIdx}>
              <div className="text-[10px] font-bold text-slate-500 tracking-wider px-3 mb-1.5 uppercase font-mono">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = store.activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        store.setActiveTab(item.id);
                        if (onClose && window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                      className={`w-full group text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-sky-950/80 to-indigo-950/60 border border-sky-500/40 text-white shadow-lg shadow-sky-950/50"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30"
                            : "bg-slate-900 text-slate-400 group-hover:text-sky-400 group-hover:bg-slate-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold truncate ${isActive ? "text-sky-300" : ""}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.sublabel && (
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">
                            {item.sublabel}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom user / quick info footer */}
        <div className="p-3 border-t border-slate-900 bg-slate-950/90 text-xs flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-300">Engine Active</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v2.4 GraphTheory</span>
        </div>
      </aside>
    </>
  );
};
