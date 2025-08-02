
"use client"
import { PageHeader } from "@/components/page-header";
import { MindMapCanvas } from "./_components/mind-map-canvas";

export default function MindspacePage() {
  return (
    <div className="flex-1 flex flex-col">
       <div className="p-4 md:p-8 md:pb-4 pt-6">
            <PageHeader title="Mindspace" />
            <p className="text-muted-foreground -mt-4">
               A creative playground where ideas are captured, expanded, and systemized visually. Double-click anywhere to start.
            </p>
        </div>
      <div className="flex-1 -mt-8 relative">
        <MindMapCanvas />
      </div>
    </div>
  );
}
