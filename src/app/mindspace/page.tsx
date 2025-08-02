
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import type { MindMapNode } from "@/lib/types";
import { MindMapCanvas } from "./_components/mind-map-canvas";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  writeBatch,
} from "firebase/firestore";

export default function MindspacePage() {
  const [nodes, setNodes] = React.useState<MindMapNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, "mindspace-nodes"));
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const fetchedNodes: MindMapNode[] = [];
        querySnapshot.forEach((doc) => {
          fetchedNodes.push({ id: doc.id, ...doc.data() } as MindMapNode);
        });

        if (fetchedNodes.length === 0) {
            // If no nodes, create a default one
            const centralNode = {
                type: 'idea',
                content: 'My Great Idea',
                position: { x: 400, y: 300 },
                connections: [],
                color: 'hsl(var(--primary))',
            };
            addDoc(collection(db, "mindspace-nodes"), centralNode);
        } else {
            setNodes(fetchedNodes);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Firebase subscription error:", error);
        toast({
          variant: "destructive",
          title: "Error fetching Mindspace",
          description: "Could not load the mind map. Please try again later.",
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const updateNode = async (
    id: string,
    data: Partial<Omit<MindMapNode, "id">>
  ) => {
    const nodeRef = doc(db, "mindspace-nodes", id);
    try {
      await updateDoc(nodeRef, data);
    } catch (error) {
      console.error("Error updating node:", error);
      toast({
          variant: "destructive",
          title: "Error updating node",
      });
    }
  };

  const addNode = async (newNodeData: Omit<MindMapNode, 'id'>) => {
      try {
          await addDoc(collection(db, "mindspace-nodes"), newNodeData);
      } catch (error) {
          console.error("Error adding node:", error);
          toast({
              variant: "destructive",
              title: "Error adding node",
          });
      }
  };
  
  const removeNode = async (id: string) => {
    const batch = writeBatch(db);

    // Reference to the node to be deleted
    const nodeToDeleteRef = doc(db, "mindspace-nodes", id);
    batch.delete(nodeToDeleteRef);

    // Remove any connections pointing to the deleted node
    nodes.forEach(node => {
        if (node.connections.includes(id)) {
            const nodeRef = doc(db, "mindspace-nodes", node.id);
            const updatedConnections = node.connections.filter(connId => connId !== id);
            batch.update(nodeRef, { connections: updatedConnections });
        }
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error("Error deleting node and connections:", error);
        toast({
            variant: "destructive",
            title: "Error deleting node",
        });
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col h-full flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Mindspace" />
      <p className="text-muted-foreground -mt-4">
        A real-time visual canvas for your ideas. Double-click to add a new idea.
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
