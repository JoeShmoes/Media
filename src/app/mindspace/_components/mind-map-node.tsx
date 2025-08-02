
"use client";

import * as React from "react";
import Draggable from "react-draggable";
import Xarrow from "react-xarrows";
import { Trash2, Link as LinkIcon, Palette } from "lucide-react";

import type { MindMapNode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";

interface MindMapNodeProps {
  node: MindMapNode;
  allNodes: MindMapNode[];
  onUpdate: (id: string, data: Partial<Omit<MindMapNode, "id">>) => void;
  onRemove: (id: string) => void;
}

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
];

export function MindMapNodeComponent({
  node,
  allNodes,
  onUpdate,
  onRemove,
}: MindMapNodeProps) {
  const nodeRef = React.useRef(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(node.id, { content: e.target.value });
  };

  const toggleConnection = (targetId: string) => {
    const isConnected = node.connections.includes(targetId);
    const newConnections = isConnected
      ? node.connections.filter((c) => c !== targetId)
      : [...node.connections, targetId];
    onUpdate(node.id, { connections: newConnections });
  };

  const handleSetColor = (color: string) => {
    onUpdate(node.id, { color });
  }

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        position={node.position}
        onStop={(e, data) => onUpdate(node.id, { position: { x: data.x, y: data.y } })}
        handle=".drag-handle"
        bounds="parent"
      >
        <div
          ref={nodeRef}
          id={node.id}
          className="absolute p-2 rounded-lg shadow-lg group"
          style={{ backgroundColor: node.color || "hsl(var(--primary))" }}
        >
          <div className="relative">
            <Textarea
              value={node.content}
              onChange={handleContentChange}
              className="bg-transparent border-none text-primary-foreground placeholder-primary-foreground/70 focus-visible:ring-0 resize-none"
              placeholder="Your idea..."
              rows={3}
            />
            <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-7 w-7 drag-handle cursor-move text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                            <Palette />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Palette className="mr-2"/> Change Color
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="flex gap-1">
                                    {colors.map(color => (
                                        <DropdownMenuItem key={color} onSelect={() => handleSetColor(color)} className="p-0">
                                            <div className="w-6 h-6 rounded-full" style={{backgroundColor: color}}></div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <LinkIcon className="mr-2"/> Connections
                            </DropdownMenuSubTrigger>
                             <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {allNodes.filter(n => n.id !== node.id).map(otherNode => (
                                         <DropdownMenuItem key={otherNode.id} onSelect={(e) => {e.preventDefault(); toggleConnection(otherNode.id)}}>
                                            {node.connections.includes(otherNode.id) ? "Disconnect from" : "Connect to"} "{otherNode.content}"
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                         <DropdownMenuItem onClick={() => onRemove(node.id)} className="text-destructive">
                            <Trash2 className="mr-2"/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        </div>
      </Draggable>
      {node.connections.map((connId) => (
        <Xarrow
          key={`${node.id}-${connId}`}
          start={node.id}
          end={connId}
          strokeWidth={2}
          color="hsl(var(--muted-foreground))"
          path="grid"
        />
      ))}
    </>
  );
}
