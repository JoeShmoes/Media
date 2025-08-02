
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import type { MindMapNode } from "@/lib/types";
import { MindMapCanvas } from "./_components/mind-map-canvas";

export default function MindspacePage() {
  const [nodes, setNodes] = React.useState<MindMapNode[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedNodes = localStorage.getItem("mindspaceNodes");
      if (savedNodes) {
        setNodes(JSON.parse(savedNodes));
      } else {
        // Initialize with a central node if no data is saved
        setNodes([
          {
            id: "central-node",
            content: "My Great Idea",
            position: { x: 400, y: 300 },
            connections: [],
            color: "hsl(var(--primary))",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load mindspace nodes from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("mindspaceNodes", JSON.stringify(nodes));
      } catch (error) {
        console.error("Failed to save mindspace nodes to local storage", error);
      }
    }
  }, [nodes, isMounted]);

  const updateNode = (
    id: string,
    data: Partial<Omit<MindMapNode, "id">>
  ) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === id ? { ...node, ...data } : node))
    );
  };

  const addNode = (newNode: MindMapNode) => {
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };
  
  const removeNode = (id: string) => {
    setNodes(prevNodes => prevNodes
      .filter(n => n.id !== id)
      .map(n => ({ ...n, connections: n.connections.filter(c => c !== id) }))
    );
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Mindspace" />
      <p className="text-muted-foreground -mt-4">
        A visual thinking canvas for your ideas. Double-click to add a new idea.
      </p>
      <div className="flex-1">
        <MindMapCanvas
          nodes={nodes}
          onUpdateNode={updateNode}
          onAddNode={addNode}
          onRemoveNode={removeNode}
        />
      </div>
    </div>
  );
}
