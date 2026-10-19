import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Graph, Vertex, Edge } from "../../types/graph";
import { useGraphStore } from "../../state/graphStore";
import { getAllDegrees } from "../../utils/degreeUtils";
import { analyzeConnectivity } from "../../algorithms/connectivity";
import { Maximize2, RotateCcw, Eye, ZoomIn, ZoomOut, Sparkles } from "lucide-react";

interface GraphCanvas3DProps {
  graph?: Graph; // If provided, renders this specific graph (e.g., in Comparison view); otherwise uses activeGraph
  height?: string;
  className?: string;
  readOnly?: boolean;
  interactiveDrag?: boolean;
  onVertexClick?: (vertex: Vertex) => void;
  onEdgeClick?: (edge: Edge) => void;
  onCanvasClick?: () => void;
  customVertexColors?: Record<string, string>;
  customEdgeColors?: Record<string, string>;
  titleBadge?: string;
}

export const GraphCanvas3D: React.FC<GraphCanvas3DProps> = ({
  graph: explicitGraph,
  height = "h-full",
  className = "",
  readOnly = false,
  interactiveDrag = true,
  onVertexClick,
  onEdgeClick,
  onCanvasClick,
  customVertexColors,
  customEdgeColors,
  titleBadge,
}) => {
  const store = useGraphStore();
  const graph = explicitGraph || store.activeGraph;

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Mesh registries for fast picking
  const vertexMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const edgeGroupRef = useRef<THREE.Group | null>(null);
  const labelGroupRef = useRef<THREE.Group | null>(null);

  // Dragging state
  const isDraggingNode = useRef<boolean>(false);
  const draggedNodeId = useRef<string | null>(null);
  const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane());
  const planeIntersectPoint = useRef<THREE.Vector3>(new THREE.Vector3());

  // Tooltip HUD
  const [hoveredNode, setHoveredNode] = useState<Vertex | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Degree cache for coloring
  const degreeMap = useRef<Map<string, number>>(new Map());
  const maxDegree = useRef<number>(1);
  const bipartiteSets = useRef<[string[], string[]] | null>(null);

  // Update degree & bipartite caches
  useEffect(() => {
    const degrees = getAllDegrees(graph);
    const dMap = new Map<string, number>();
    let maxD = 1;
    degrees.forEach((d) => {
      dMap.set(d.id, d.degree);
      if (d.degree > maxD) maxD = d.degree;
    });
    degreeMap.current = dMap;
    maxDegree.current = maxD;

    const conn = analyzeConnectivity(graph);
    bipartiteSets.current = conn.isBipartite && conn.bipartiteSets ? conn.bipartiteSets : null;
  }, [graph]);

  // Helper to resolve vertex color
  const getVertexColor = useCallback(
    (v: Vertex): string => {
      if (customVertexColors && customVertexColors[v.id]) {
        return customVertexColors[v.id];
      }
      if (v.color) return v.color;

      const mode = store.visualSettings.colorMode;
      if (mode === "degree") {
        const d = degreeMap.current.get(v.id) ?? 0;
        const ratio = Math.min(1, Math.max(0, d / (maxDegree.current || 1)));
        // Interpolate cyan (#06B6D4) -> emerald (#10B981) -> amber (#F59E0B) -> rose (#F43F5E)
        if (ratio < 0.33) return "#06B6D4";
        if (ratio < 0.66) return "#10B981";
        if (ratio < 0.9) return "#F59E0B";
        return "#F43F5E";
      }

      if (mode === "bipartite" && bipartiteSets.current) {
        if (bipartiteSets.current[0].includes(v.id)) return "#38BDF8"; // Sky Blue set
        if (bipartiteSets.current[1].includes(v.id)) return "#F43F5E"; // Rose Red set
      }

      if (mode === "type" || mode === "default") {
        switch (v.type) {
          case "user":
            return "#38BDF8"; // Vibrant sky blue
          case "website":
            return "#818CF8"; // Indigo
          case "location":
            return "#34D399"; // Emerald green
          case "house":
            return "#F59E0B"; // Amber orange
          case "utility":
            return "#EC4899"; // Hot pink
          default:
            return "#60A5FA";
        }
      }

      return "#60A5FA";
    },
    [customVertexColors, store.visualSettings.colorMode]
  );

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070b14");
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / heightPx, 0.1, 1000);
    camera.position.set(0, 10, 20);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 80;
    controls.minDistance = 3;
    controlsRef.current = controls;

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x60a5fa, 1.2);
    dirLight1.position.set(15, 25, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 0.6);
    dirLight2.position.set(-15, -10, -15);
    scene.add(dirLight2);

    // Subtle grid floor
    if (store.visualSettings.gridFloor) {
      const grid = new THREE.GridHelper(30, 30, 0x1e293b, 0x0f172a);
      grid.position.y = -4;
      scene.add(grid);
    }

    // Groups
    const edgeGroup = new THREE.Group();
    scene.add(edgeGroup);
    edgeGroupRef.current = edgeGroup;

    const labelGroup = new THREE.Group();
    scene.add(labelGroup);
    labelGroupRef.current = labelGroup;

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (store.visualSettings.autoRotate && controlsRef.current && !isDraggingNode.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.0;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      controlsRef.current?.update();

      // Billboard label rotation towards camera
      if (labelGroupRef.current && cameraRef.current) {
        labelGroupRef.current.children.forEach((child) => {
          child.quaternion.copy(cameraRef.current!.quaternion);
        });
      }

      // Gentle pulsing for active/highlighted elements
      vertexMeshesRef.current.forEach((mesh, vId) => {
        const isSelected = store.selectedVertexId === vId;
        const isPath = store.highlightedPath.includes(vId);
        if (isSelected || isPath) {
          const s = (isSelected ? 1.4 : 1.2) + Math.sin(elapsedTime * 6) * 0.08;
          mesh.scale.set(s, s, s);
        } else {
          mesh.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [store.visualSettings.gridFloor, store.visualSettings.autoRotate]);

  // Center & Fit Camera to Graph
  const centerCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || graph.vertices.length === 0) return;
    const box = new THREE.Box3();
    graph.vertices.forEach((v) => {
      box.expandByPoint(new THREE.Vector3(...v.position));
    });

    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 5);

    controlsRef.current.target.copy(center);
    cameraRef.current.position.set(center.x, center.y + maxDim * 0.9, center.z + maxDim * 1.6);
    cameraRef.current.lookAt(center);
    controlsRef.current.update();
  }, [graph.vertices]);

  // Trigger camera reset on store counter change
  useEffect(() => {
    centerCamera();
  }, [store.resetCameraCounter, centerCamera]);

  // Re-build Graph Scene (Nodes, Edges, Billboards)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old vertex meshes
    vertexMeshesRef.current.forEach((mesh) => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    vertexMeshesRef.current.clear();

    // Clear edge group
    if (edgeGroupRef.current) {
      while (edgeGroupRef.current.children.length > 0) {
        const obj = edgeGroupRef.current.children[0] as THREE.Mesh;
        edgeGroupRef.current.remove(obj);
        obj.geometry?.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      }
    }

    // Clear label group
    if (labelGroupRef.current) {
      while (labelGroupRef.current.children.length > 0) {
        const obj = labelGroupRef.current.children[0] as THREE.Sprite;
        labelGroupRef.current.remove(obj);
        obj.geometry?.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      }
    }

    const vertexMap = new Map<string, Vertex>();
    graph.vertices.forEach((v) => vertexMap.set(v.id, v));

    // 1. Build Vertex Meshes
    const nodeRadius = 0.55 * store.visualSettings.nodeSize;
    const sphereGeo = new THREE.SphereGeometry(nodeRadius, 24, 24);

    graph.vertices.forEach((v) => {
      const colorHex = getVertexColor(v);
      const isSelected = store.selectedVertexId === v.id;
      const isHovered = store.hoveredVertexId === v.id;
      const isShortestPath = store.highlightedPath.includes(v.id);

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.2,
        metalness: 0.4,
        emissive: new THREE.Color(
          isSelected
            ? 0xffffff
            : isShortestPath
            ? 0x22c55e
            : isHovered
            ? 0x38bdf8
            : colorHex
        ),
        emissiveIntensity: isSelected ? 0.8 : isShortestPath ? 0.7 : isHovered ? 0.5 : 0.25,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(...v.position);
      mesh.userData = { vertexId: v.id, vertex: v };
      scene.add(mesh);
      vertexMeshesRef.current.set(v.id, mesh);

      // Node Billboard Label
      if (store.visualSettings.showLabels && labelGroupRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
          ctx.roundRect(10, 8, 236, 48, 12);
          ctx.fill();
          ctx.strokeStyle = colorHex;
          ctx.lineWidth = 3;
          ctx.roundRect(10, 8, 236, 48, 12);
          ctx.stroke();

          ctx.font = "bold 24px ui-sans-serif, system-ui, sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(v.label, 128, 32);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(v.position[0], v.position[1] + nodeRadius + 0.5, v.position[2]);
        sprite.scale.set(2.4, 0.6, 1);
        labelGroupRef.current.add(sprite);
      }
    });

    // 2. Build Edges
    const lineThickness = 0.05 * store.visualSettings.edgeThickness;

    graph.edges.forEach((edge) => {
      const src = vertexMap.get(edge.source);
      const tgt = vertexMap.get(edge.target);
      if (!src || !tgt) return;

      const p1 = new THREE.Vector3(...src.position);
      const p2 = new THREE.Vector3(...tgt.position);
      const distance = p1.distanceTo(p2);
      if (distance < 0.001) return;

      const isPathEdge = store.highlightedEdges.includes(edge.id);
      const isSelectedEdge = store.selectedEdgeId === edge.id;

      let edgeColor = "#475569";
      if (customEdgeColors && customEdgeColors[edge.id]) {
        edgeColor = customEdgeColors[edge.id];
      } else if (isPathEdge) {
        edgeColor = "#22C55E"; // Shortest path neon green
      } else if (isSelectedEdge) {
        edgeColor = "#FACC15"; // Yellow
      } else if (edge.color) {
        edgeColor = edge.color;
      } else if (edge.type === "road") {
        edgeColor = "#F59E0B";
      } else if (edge.type === "follow") {
        edgeColor = "#38BDF8";
      } else if (edge.type === "link") {
        edgeColor = "#818CF8";
      }

      // Cylinder Edge
      const cylinderGeo = new THREE.CylinderGeometry(
        isPathEdge || isSelectedEdge ? lineThickness * 2.2 : lineThickness,
        isPathEdge || isSelectedEdge ? lineThickness * 2.2 : lineThickness,
        distance,
        8
      );

      const cylinderMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(edgeColor),
        emissive: new THREE.Color(edgeColor),
        emissiveIntensity: isPathEdge ? 0.9 : isSelectedEdge ? 0.8 : 0.2,
        roughness: 0.3,
        metalness: 0.2,
      });

      const cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
      cylinderMesh.userData = { edgeId: edge.id, edge };

      // Orient cylinder between p1 and p2
      const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      cylinderMesh.position.copy(midpoint);

      const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
      cylinderMesh.setRotationFromQuaternion(quaternion);

      edgeGroupRef.current?.add(cylinderMesh);

      // Directed Arrow Head Cone
      const isDirected = edge.directed !== undefined ? edge.directed : graph.directed;
      if (isDirected && store.visualSettings.showArrows) {
        const coneRadius = 0.16 * store.visualSettings.edgeThickness;
        const coneHeight = 0.45 * store.visualSettings.edgeThickness;
        const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 12);
        const coneMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(edgeColor),
          emissive: new THREE.Color(edgeColor),
          emissiveIntensity: isPathEdge ? 0.9 : 0.4,
        });

        const coneMesh = new THREE.Mesh(coneGeo, coneMat);

        // Place arrow at 70% towards target, stopping just outside target sphere
        const arrowPos = new THREE.Vector3().copy(p1).add(direction.clone().multiplyScalar(Math.max(0, distance - (nodeRadius + 0.25))));
        coneMesh.position.copy(arrowPos);
        coneMesh.setRotationFromQuaternion(quaternion);
        edgeGroupRef.current?.add(coneMesh);
      }

      // Weight / Label Billboard
      if (store.visualSettings.showWeights && (edge.weight !== undefined || edge.label) && labelGroupRef.current) {
        const textStr = edge.label || `${edge.weight}km`;
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 48;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
          ctx.roundRect(8, 6, 144, 36, 10);
          ctx.fill();
          ctx.strokeStyle = edgeColor;
          ctx.lineWidth = 2;
          ctx.roundRect(8, 6, 144, 36, 10);
          ctx.stroke();

          ctx.font = "bold 18px ui-sans-serif, system-ui, sans-serif";
          ctx.fillStyle = "#F8FAFC";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(textStr, 80, 24);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(midpoint).add(new THREE.Vector3(0, 0.4, 0));
        sprite.scale.set(1.4, 0.45, 1);
        labelGroupRef.current.add(sprite);
      }
    });
  }, [
    graph,
    store.selectedVertexId,
    store.selectedEdgeId,
    store.hoveredVertexId,
    store.highlightedPath,
    store.highlightedEdges,
    store.visualSettings,
    getVertexColor,
    customVertexColors,
    customEdgeColors,
  ]);

  // Mouse Raycasting & Dragging Interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const container = containerRef.current;
    if (!container || !cameraRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Raycast against vertices
    const vertexMeshes = Array.from(vertexMeshesRef.current.values());
    const vIntersects = raycaster.intersectObjects(vertexMeshes, false);

    if (vIntersects.length > 0) {
      const hit = vIntersects[0].object as THREE.Mesh;
      const vId = hit.userData.vertexId;
      const vertex = hit.userData.vertex as Vertex;

      store.setSelectedVertexId(vId);
      store.setSelectedEdgeId(null);
      if (onVertexClick) onVertexClick(vertex);

      if (interactiveDrag && controlsRef.current) {
        isDraggingNode.current = true;
        draggedNodeId.current = vId;
        controlsRef.current.enabled = false;

        // Plane perpendicular to camera looking at vertex
        const normal = cameraRef.current.getWorldDirection(new THREE.Vector3()).negate();
        dragPlaneRef.current.setFromNormalAndCoplanarPoint(normal, hit.position);
      }
      return;
    }

    // Raycast against edges
    if (edgeGroupRef.current) {
      const eIntersects = raycaster.intersectObjects(edgeGroupRef.current.children, false);
      if (eIntersects.length > 0) {
        const hitEdge = eIntersects[0].object;
        if (hitEdge.userData?.edgeId) {
          store.setSelectedEdgeId(hitEdge.userData.edgeId);
          store.setSelectedVertexId(null);
          if (onEdgeClick) onEdgeClick(hitEdge.userData.edge);
          return;
        }
      }
    }

    // Clicked empty canvas
    store.setSelectedVertexId(null);
    store.setSelectedEdgeId(null);
    if (onCanvasClick) onCanvasClick();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    // Dragging Active
    if (isDraggingNode.current && draggedNodeId.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      if (raycaster.ray.intersectPlane(dragPlaneRef.current, planeIntersectPoint.current)) {
        const vId = draggedNodeId.current;
        const newPos: [number, number, number] = [
          Number(planeIntersectPoint.current.x.toFixed(2)),
          Number(planeIntersectPoint.current.y.toFixed(2)),
          Number(planeIntersectPoint.current.z.toFixed(2)),
        ];

        // Update local mesh instantly
        const mesh = vertexMeshesRef.current.get(vId);
        if (mesh) mesh.position.set(...newPos);

        // Update store
        store.updateVertex(vId, { position: newPos });
      }
      return;
    }

    // Hover detection for Tooltip HUD
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const vertexMeshes = Array.from(vertexMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(vertexMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const vertex = hit.userData.vertex as Vertex;
      setHoveredNode(vertex);
      store.setHoveredVertexId(vertex.id);
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      container.style.cursor = "pointer";
    } else {
      if (hoveredNode) {
        setHoveredNode(null);
        store.setHoveredVertexId(null);
        setTooltipPos(null);
        container.style.cursor = "default";
      }
    }
  };

  const handlePointerUp = () => {
    if (isDraggingNode.current) {
      isDraggingNode.current = false;
      draggedNodeId.current = null;
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  };

  return (
    <div
      className={`relative w-full ${height} overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-md canvas-container select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Three.js viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Title Badge & Controls Top Left */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        {titleBadge && (
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-sky-400 bg-slate-900/90 border border-sky-500/30 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            {titleBadge}
          </span>
        )}
        <span className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-900/80 border border-slate-700/60 rounded-md backdrop-blur-md pointer-events-auto">
          |V| = {graph.vertices.length} &nbsp;|&nbsp; |E| = {graph.edges.length}
        </span>
      </div>

      {/* Floating Canvas Controls Top Right */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={centerCamera}
          title="Reset Camera View"
          className="p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg shadow-lg backdrop-blur-md transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (controlsRef.current && cameraRef.current) {
              cameraRef.current.position.multiplyScalar(0.85);
              controlsRef.current.update();
            }
          }}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg shadow-lg backdrop-blur-md transition-all active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (controlsRef.current && cameraRef.current) {
              cameraRef.current.position.multiplyScalar(1.15);
              controlsRef.current.update();
            }
          }}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg shadow-lg backdrop-blur-md transition-all active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => store.updateVisualSettings({ autoRotate: !store.visualSettings.autoRotate })}
          title={store.visualSettings.autoRotate ? "Pause Orbit" : "Auto Orbit 3D"}
          className={`p-2 border rounded-lg shadow-lg backdrop-blur-md transition-all active:scale-95 ${
            store.visualSettings.autoRotate
              ? "text-sky-400 bg-sky-950/70 border-sky-500/50"
              : "text-slate-400 bg-slate-900/80 hover:bg-slate-800 border-slate-700/80"
          }`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Tooltip HUD on Vertex Hover */}
      {hoveredNode && tooltipPos && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 bg-slate-900/95 border border-sky-500/40 rounded-lg shadow-2xl backdrop-blur-md text-xs text-slate-100 min-w-[140px]"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between gap-2 mb-1 border-b border-slate-800 pb-1">
            <span className="font-bold text-sky-400">{hoveredNode.label}</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {hoveredNode.type || "node"}
            </span>
          </div>
          <div className="space-y-0.5 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-400">Total Degree:</span>{" "}
              <span className="font-mono font-semibold text-emerald-400">
                {degreeMap.current.get(hoveredNode.id) ?? 0}
              </span>
            </div>
            {graph.directed && (
              <div className="flex justify-between gap-2">
                <span>In: {graph.edges.filter((e) => e.target === hoveredNode.id).length}</span>
                <span>Out: {graph.edges.filter((e) => e.source === hoveredNode.id).length}</span>
              </div>
            )}
            {hoveredNode.metadata && Object.keys(hoveredNode.metadata).length > 0 && (
              <div className="pt-1 text-[10px] text-slate-400 italic">
                {hoveredNode.metadata.role || hoveredNode.metadata.building || hoveredNode.metadata.category}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instruction hint bottom center */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[11px] text-slate-500 bg-slate-950/70 px-3 py-0.5 rounded-full border border-slate-800/80 backdrop-blur-sm pointer-events-none">
        Left Click: Rotate • Right Click: Pan • Scroll: Zoom • Drag Node: 3D Sculpt
      </div>
    </div>
  );
};
