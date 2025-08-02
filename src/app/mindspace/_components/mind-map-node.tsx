
"use client"
import * as React from "react"
import Draggable from "react-draggable"
import { Trash2, Link, Palette, Move, X } from "lucide-react"

import type { MindMapNode } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MindMapNodeProps {
  node: MindMapNode
  onUpdate: (id: string, data: Partial<Omit<MindMapNode, "id">>) => void
  onDelete: (id: string) => void
  allNodes: MindMapNode[]
}

const colors = [
  "bg-yellow-200", "bg-blue-200", "bg-green-200", "bg-red-200", "bg-purple-200",
]

export function MindMapNodeComponent({ node, onUpdate, onDelete, allNodes }: MindMapNodeProps) {
  const nodeRef = React.useRef(null);
  const [isConnecting, setIsConnecting] = React.useState(false)

  const handleConnect = (endNodeId: string) => {
    const currentConnections = node.connections || []
    if (currentConnections.includes(endNodeId)) {
      // Disconnect
      onUpdate(node.id, { connections: currentConnections.filter(id => id !== endNodeId) })
    } else {
      // Connect
      onUpdate(node.id, { connections: [...currentConnections, endNodeId] })
    }
    setIsConnecting(false)
  }

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        position={node.position}
        onStop={(e, data) => onUpdate(node.id, { position: { x: data.x, y: data.y } })}
        handle=".drag-handle"
      >
        <div 
          ref={nodeRef}
          id={node.id} 
          className={`absolute p-4 rounded-lg shadow-lg w-64 flex flex-col gap-2 ${node.color || 'bg-yellow-200'}`}
        >
          <div className="flex justify-end items-center gap-1">
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Palette className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="flex gap-1">
                  {colors.map(color => (
                    <Button
                      key={color}
                      size="icon"
                      className={`h-6 w-6 rounded-full ${color}`}
                      onClick={() => onUpdate(node.id, { color })}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={isConnecting} onOpenChange={setIsConnecting}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Link className="h-4 w-4" /></Button>
              </PopoverTrigger>
               <PopoverContent className="w-64">
                <div className="space-y-2">
                    <p className="font-medium text-sm">Connect to...</p>
                    {allNodes.filter(n => n.id !== node.id).map(otherNode => (
                        <Button key={otherNode.id} variant="ghost" className="w-full justify-start" onClick={() => handleConnect(otherNode.id)}>
                            <span className="truncate">{otherNode.content}</span>
                        </Button>
                    ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="h-6 w-6 drag-handle cursor-move"><Move className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => onDelete(node.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <Textarea
            value={node.content}
            onChange={(e) => onUpdate(node.id, { content: e.target.value })}
            className={`bg-transparent border-none focus-visible:ring-0 resize-none text-base font-medium placeholder:text-black/50 text-black`}
            placeholder="New Idea..."
          />
        </div>
      </Draggable>
    </>
  )
}
