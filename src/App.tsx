import React, { useState, useEffect } from "react";
import { GraphProvider, useGraphStore } from "./state/graphStore";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { BottomStatsBar } from "./components/layout/BottomStatsBar";
import { InspectorDrawer } from "./components/layout/InspectorDrawer";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { SocialMedia } from "./pages/SocialMedia";
import { WebGraph } from "./pages/WebGraph";
import { CampusMap } from "./pages/CampusMap";
import { UtilityProblem } from "./pages/UtilityProblem";
import { GraphComparison } from "./pages/GraphComparison";
import { MatrixRepresentation } from "./pages/MatrixRepresentation";
import { GraphBuilder } from "./pages/GraphBuilder";
import { AlgorithmsStudio } from "./pages/AlgorithmsStudio";
import { GraphColoring } from "./pages/GraphColoring";
import { ChallengeQuiz } from "./pages/ChallengeQuiz";
import { PresentationMode } from "./pages/PresentationMode";
import { AboutTheory } from "./pages/AboutTheory";

const MainContent: React.FC = () => {
  const store = useGraphStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        store.setSelectedVertexId(null);
        store.setSelectedEdgeId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store]);

  const renderActiveTab = () => {
    switch (store.activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "social":
        return <SocialMedia />;
      case "web":
        return <WebGraph />;
      case "campus":
        return <CampusMap />;
      case "utility":
        return <UtilityProblem />;
      case "comparison":
        return <GraphComparison />;
      case "matrix":
        return <MatrixRepresentation />;
      case "builder":
        return <GraphBuilder />;
      case "algorithms":
        return <AlgorithmsStudio />;
      case "coloring":
        return <GraphColoring />;
      case "challenges":
        return <ChallengeQuiz />;
      case "presentation":
        return <PresentationMode />;
      case "theory":
        return <AboutTheory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex-col">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main Center Area: Sidebar + Active Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto relative bg-[#070b14]">
          <ErrorBoundary>
            {renderActiveTab()}
          </ErrorBoundary>

          {/* Floating Context Inspector Drawer */}
          <InspectorDrawer />
        </main>
      </div>

      {/* Sticky Bottom Topological Metrics Bar */}
      <BottomStatsBar />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <GraphProvider>
        <MainContent />
      </GraphProvider>
    </ErrorBoundary>
  );
}
