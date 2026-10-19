import React, { useState, useMemo } from "react";
import { GraphCanvas3D } from "../components/graph/GraphCanvas3D";
import { useGraphStore } from "../state/graphStore";
import { SOCIAL_GRAPH_A, SOCIAL_GRAPH_B, SAMPLE_USERS } from "../data/socialGraphs";
import { getAllDegrees } from "../utils/degreeUtils";
import { Users, TrendingUp, UserCheck, GitCompare, UserPlus, Sparkles, ArrowRight } from "lucide-react";

export const SocialMedia: React.FC = () => {
  const store = useGraphStore();
  const [activeNetwork, setActiveNetwork] = useState<"A" | "B">("A");
  const [selectedUserFilter, setSelectedUserFilter] = useState<string | null>(null);

  const currentGraph = activeNetwork === "A" ? SOCIAL_GRAPH_A : SOCIAL_GRAPH_B;

  // Degrees & Influencers analysis
  const userStats = useMemo(() => {
    const degrees = getAllDegrees(currentGraph);
    return degrees
      .map((deg) => {
        const userMeta = SAMPLE_USERS.find((u) => u.id === deg.id);
        const inDeg = deg.inDegree;
        const outDeg = deg.outDegree;
        const ratio = outDeg > 0 ? (inDeg / outDeg).toFixed(2) : inDeg > 0 ? "∞" : "0.0";
        return {
          id: deg.id,
          label: deg.label,
          handle: userMeta?.handle || `@${deg.label.toLowerCase()}`,
          role: userMeta?.role || "Student",
          bio: userMeta?.bio || "Active campus member",
          inDegree: inDeg,
          outDegree: outDeg,
          totalDegree: deg.degree,
          ratio,
        };
      })
      .sort((a, b) => b.inDegree - a.inDegree);
  }, [currentGraph]);

  const topInfluencer = userStats[0];

  const handleSwitchNetwork = (net: "A" | "B") => {
    setActiveNetwork(net);
    store.setActiveGraph(net === "A" ? SOCIAL_GRAPH_A : SOCIAL_GRAPH_B);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserFilter(userId);
    store.setSelectedVertexId(userId);
  };

  // Find mutual friends for selected user
  const mutualConnections = useMemo(() => {
    if (!selectedUserFilter) return [];
    const outgoing = new Set(currentGraph.edges.filter((e) => e.source === selectedUserFilter).map((e) => e.target));
    const incoming = new Set(currentGraph.edges.filter((e) => e.target === selectedUserFilter).map((e) => e.source));
    const mutuals: string[] = [];
    outgoing.forEach((targetId) => {
      if (incoming.has(targetId)) mutuals.push(targetId);
    });
    return mutuals.map((id) => currentGraph.vertices.find((v) => v.id === id)?.label || id);
  }, [selectedUserFilter, currentGraph]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-400">
            <Users className="w-4 h-4" />
            REAL-WORLD DIRECTED NETWORK
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Social Media Follower Graph (15 Nodes)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            In social platforms (Instagram, X, Bluesky), vertices represent individual users. Directed edges
            represent follows ($A \rightarrow B$). Followers are measured by <span className="text-sky-300 font-semibold">In-Degree</span>, while accounts followed represent <span className="text-purple-300 font-semibold">Out-Degree</span>.
          </p>
        </div>

        {/* Network Toggle A / B */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => handleSwitchNetwork("A")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeNetwork === "A" ? "bg-sky-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Network Alpha (A)
            </button>
            <button
              onClick={() => handleSwitchNetwork("B")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeNetwork === "B" ? "bg-sky-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Network Beta (B)
            </button>
          </div>

          <button
            onClick={() => {
              store.setComparisonGraphA(SOCIAL_GRAPH_A);
              store.setComparisonGraphB(SOCIAL_GRAPH_B);
              store.setActiveTab("comparison");
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare A vs B</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Canvas + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Canvas Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
            <GraphCanvas3D
              graph={currentGraph}
              titleBadge={`Social Network ${activeNetwork} (${currentGraph.vertices.length} Users)`}
              onVertexClick={(v) => setSelectedUserFilter(v.id)}
            />
          </div>

          {/* Theoretical Concept Callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] font-mono text-sky-400 font-semibold mb-1">IN-DEGREE (FOLLOWERS)</div>
              <p className="text-xs text-slate-300">
                Number of edges pointing <span className="italic font-bold">into</span> a node. Signifies popularity, authority, and reach across the network.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] font-mono text-purple-400 font-semibold mb-1">OUT-DEGREE (FOLLOWING)</div>
              <p className="text-xs text-slate-300">
                Number of outgoing edges directed towards others. Represents active engagement and curation of information.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-1">RECIPROCAL (MUTUALS)</div>
              <p className="text-xs text-slate-300">
                Pairs where both $u \rightarrow v$ and $v \rightarrow u$ exist. Represents two-way friendships or peer collaborations.
              </p>
            </div>
          </div>
        </div>

        {/* User Leaderboard & Selected Details */}
        <div className="space-y-4">
          {/* Top Influencer Spotlight */}
          {topInfluencer && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/70 via-indigo-950/40 to-slate-900 border border-sky-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 rounded-full bg-sky-900/60 border border-sky-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-300" />
                  TOP INFLUENCER
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {topInfluencer.inDegree} Followers
                </span>
              </div>
              <div className="text-base font-bold text-white">{topInfluencer.label}</div>
              <div className="text-xs text-sky-300 font-mono">{topInfluencer.handle}</div>
              <div className="text-xs text-slate-300 mt-2">{topInfluencer.role} • {topInfluencer.bio}</div>
            </div>
          )}

          {/* User Roster / Ranking Table */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col h-[340px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Influence Roster</span>
              <span className="text-[10px] font-mono text-slate-500">Sorted by In-Degree</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {userStats.map((u, idx) => {
                const isSelected = selectedUserFilter === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleUserSelect(u.id)}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-sky-950 border border-sky-500/40 text-white"
                        : "hover:bg-slate-800/80 text-slate-300 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 w-4 text-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-100">{u.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{u.handle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right font-mono">
                      <div>
                        <div className="text-sky-400 font-bold">{u.inDegree}</div>
                        <div className="text-[9px] text-slate-500">followers</div>
                      </div>
                      <div>
                        <div className="text-purple-400">{u.outDegree}</div>
                        <div className="text-[9px] text-slate-500">following</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedUserFilter && mutualConnections.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Mutuals:</span>{" "}
                {mutualConnections.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
