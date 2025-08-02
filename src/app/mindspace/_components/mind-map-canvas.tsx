
"use client";

import * as React from "react";
import type { MindMapNode } from "@/lib/types";
import { MindMapNodeComponent } from "./mind-map-node";
import { Xwrapper } from "react-xarrows";

interface MindMapCanvasProps {
  nodes: MindMapNode[];
  onUpdateNode: (id: string, data: Partial<Omit<MindMapNode, "id">>) => void;
  onAddNode: (node: Omit<MindMapNode, 'id'>) => void;
  onRemoveNode: (id: string) => void;
}

export function MindMapCanvas({
  nodes,
  onUpdateNode,
  onAddNode,
  onRemoveNode,
}: MindMapCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== canvasRef.current || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newNode: Omit<MindMapNode, 'id'> = {
      type: 'idea',
      content: "New Idea",
      position: {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      },
      connections: [],
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    onAddNode(newNode);
  };
  

  return (
    <div
      ref={canvasRef}
      className="w-full h-[75vh] relative bg-muted/20 rounded-lg border border-dashed overflow-hidden"
      onDoubleClick={handleDoubleClick}
    >
      <Xwrapper>
        {nodes.map((node) => (
          <MindMapNodeComponent
            key={node.id}
            node={node}
            allNodes={nodes}
            onUpdate={onUpdateNode}
            onRemove={onRemoveNode}
          />
        ))}
      </Xwrapper>
    </div>
  );
}
