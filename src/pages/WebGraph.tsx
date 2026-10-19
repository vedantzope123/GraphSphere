import React, { useState, useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { WEB_GRAPH } from "../data/webGraph";
import { getAllDegrees } from "../utils/degreeUtils";
import { Globe, Search, Link2, ExternalLink, Play, RotateCcw, Sparkles } from "lucide-react";

export const WebGraph: React.FC = () => {
  const store = useGraphStore();
  const [crawling, setCrawling] = useState(false);
  const [crawlerStep, setCrawlerStep] = useState(0);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);

  // Degree & Page Authority ranking
  const webStats = useMemo(() => {
    const degrees = getAllDegrees(WEB_GRAPH);
    return degrees
      .map((deg) => {
        const vertex = WEB_GRAPH.vertices.find((v) => v.id === deg.id);
        const backlinks = deg.inDegree;
        const outbound = deg.outDegree;
        // Simplified PageRank heuristic
        const heuristicScore = (backlinks * 1.5 + outbound * 0.4 + 1.0).toFixed(1);
        return {
          id: deg.id,
          label: deg.label,
          domain: vertex?.metadata?.url || `${deg.label.toLowerCase().replace(/\s+/g, "")}.edu`,
          category: vertex?.metadata?.category || "Web Resource",
          backlinks,
          outbound,
          score: heuristicScore,
        };
      })
      .sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  }, []);

  // Web Crawler simulation
  const handleStartCrawler = () => {
    setCrawling(true);
    setVisitedPages(["w_google"]);
    store.setHighlightedPath(["w_google"]);
    store.setSelectedVertexId("w_google");

    let current = ["w_google"];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCrawlerStep(step);

      // Find outbound links from current frontier
      const nextFrontier: string[] = [];
      current.forEach((nodeId) => {
        WEB_GRAPH.edges
          .filter((e) => e.source === nodeId)
          .forEach((e) => {
            if (!visitedPages.includes(e.target) && !nextFrontier.includes(e.target)) {
              nextFrontier.push(e.target);
            }
          });
      });

      if (nextFrontier.length === 0 || step >= 5) {
        clearInterval(interval);
        setCrawling(false);
      } else {
        setVisitedPages((prev) => {
          const updated = Array.from(new Set([...prev, ...nextFrontier]));
          store.setHighlightedPath(updated);
          return updated;
        });
        current = nextFrontier;
      }
    }, 1200);
  };

  const handleResetCrawler = () => {
    setCrawling(false);
    setCrawlerStep(0);
    setVisitedPages([]);
    store.setHighlightedPath([]);
    store.setSelectedVertexId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-400">
            <Globe className="w-4 h-4" />
            WORLD WIDE WEB TOPOLOGY
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            The Web Graph & Hyperlink Authority
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            In web information retrieval, web pages are modeled as vertices and directed hyperlinks as edges.
            In-degree corresponds directly to <span className="text-indigo-300 font-semibold">Backlinks</span>,
            forming the foundational intuition for algorithms like PageRank and HITS (Hubs & Authorities).
          </p>
        </div>

        {/* Crawler Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={crawling ? undefined : handleStartCrawler}
            disabled={crawling}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Play className={`w-3.5 h-3.5 ${crawling ? "animate-spin" : ""}`} />
            <span>{crawling ? `Crawling Hop #${crawlerStep}...` : "Simulate Web Crawler"}</span>
          </button>

          <button
            onClick={handleResetCrawler}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: 3D View + Authority Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D
              graph={WEB_GRAPH}
              titleBadge="The Web Graph (Directed Hyperlinks)"
              onVertexClick={(v) => store.setSelectedVertexId(v.id)}
            />
          </div>

          {/* Crawler Log HUD */}
          {visitedPages.length > 0 && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span className="font-semibold text-indigo-200">
                  Crawler Discovered {visitedPages.length} Pages:
                </span>
                <span className="text-slate-300 font-mono">
                  {visitedPages
                    .map((id) => WEB_GRAPH.vertices.find((v) => v.id === id)?.label)
                    .join(" ➔ ")}
                </span>
              </div>
            </div>
          )}

          {/* Educational Concept Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-mono text-indigo-400 font-semibold mb-1">
                BACKLINK IMPORTANCE
              </div>
              <p className="text-xs text-slate-300">
                A webpage with high in-degree is endorsed by many other pages. If those referencing pages themselves have high in-degree, the target page acquires even greater rank weight.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-mono text-sky-400 font-semibold mb-1">
                SEARCH ENGINE SPIDERS
              </div>
              <p className="text-xs text-slate-300">
                Spiders (Googlebot) perform continuous Graph Traversals (BFS / priority queues), discovering new URLs by following directed $A \rightarrow B$ hyperlink edges.
              </p>
            </div>
          </div>
        </div>

        {/* Authority Table Column */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200">Authority & Backlink Index</span>
            <span className="text-[10px] font-mono text-slate-500">Heuristic Rank</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {webStats.map((item, idx) => {
              const isSelected = store.selectedVertexId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => store.setSelectedVertexId(item.id)}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-indigo-950 border border-indigo-500/40 text-white"
                      : "hover:bg-slate-800/80 text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] text-slate-500 w-4 text-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        {item.label}
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.domain}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right font-mono">
                    <div>
                      <div className="text-indigo-400 font-bold">{item.backlinks}</div>
                      <div className="text-[9px] text-slate-500">backlinks</div>
                    </div>
                    <div>
                      <div className="text-emerald-400 font-bold">{item.score}</div>
                      <div className="text-[9px] text-slate-500">rank</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
