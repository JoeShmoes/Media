
"use client"

import * as React from "react"
import Xarrow from "react-xarrows"
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

import { MindMapNodeComponent } from "./mind-map-node"
import type { MindMapNode } from "@/lib/types"
import { db } from "@/lib/firebase";

export function MindMapCanvas() {
    const [nodesSnapshot, loading, error] = useCollection(collection(db, "mindmap-nodes"));

    const nodes: MindMapNode[] = React.useMemo(() => {
        if (!nodesSnapshot) return [];
        return nodesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MindMapNode));
    }, [nodesSnapshot]);


  const addNode = async (x: number, y: number) => {
    try {
        await addDoc(collection(db, "mindmap-nodes"), {
            content: "New Idea",
            position: { x, y },
            connections: [],
            color: "bg-yellow-200",
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
  }

  const updateNode = async (id: string, data: Partial<Omit<MindMapNode, 'id'>>) => {
     try {
        const nodeRef = doc(db, "mindmap-nodes", id);
        await updateDoc(nodeRef, data);
    } catch (e) {
        console.error("Error updating document: ", e);
    }
  }

  const deleteNode = async (id: string) => {
    try {
        await deleteDoc(doc(db, "mindmap-nodes", id));
        // Also remove connections from other nodes
        nodes.forEach(node => {
            if(node.connections.includes(id)) {
                updateNode(node.id, { connections: node.connections.filter(cId => cId !== id) });
            }
        })
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the double click was on the canvas background
    if (e.target === e.currentTarget) {
      addNode(e.clientX, e.clientY)
    }
  }

  if (loading) return <div className="h-full flex items-center justify-center"><p>Loading Mindspace...</p></div>
  if (error) return <div className="h-full flex items-center justify-center"><p>Error: {error.message}</p></div>

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onDoubleClick={handleDoubleClick}
      id="canvas"
    >
      {nodes.map(node => (
        <MindMapNodeComponent
          key={node.id}
          node={node}
          onUpdate={updateNode}
          onDelete={deleteNode}
          allNodes={nodes}
        />
      ))}
       {nodes.flatMap(node =>
        node.connections.map(endNodeId => {
          // Check if the end node exists before rendering an arrow
          if (nodes.some(n => n.id === endNodeId)) {
            return (
              <Xarrow
                key={`${node.id}-${endNodeId}`}
                start={node.id}
                end={endNodeId}
                startAnchor="auto"
                endAnchor="auto"
                strokeWidth={2}
                color="hsl(var(--foreground) / 0.5)"
                headSize={6}
              />
            )
          }
          return null
        })
      )}
    </div>
  )
}
