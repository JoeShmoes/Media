
"use client"
import * as React from "react";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TemplateType } from "@/lib/types";
import { TemplateBuilderSidebar } from "./_components/template-builder-sidebar";
import { TaskTemplatesView } from "./_components/task-templates-view";
import { NoteTemplatesView } from "./_components/note-templates-view";


export default function TemplateBuilderPage() {
  const [activeTemplateType, setActiveTemplateType] = React.useState<TemplateType>("Task");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderContent = () => {
    switch (activeTemplateType) {
      case "Task":
        return <TaskTemplatesView />;
      case "Note":
        return <NoteTemplatesView />;
      default:
        return <p>Select a template type to begin.</p>;
    }
  };
  
  if (!isMounted) return null;

  return (
    <div className="flex h-full">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-72" : "w-0"
        )}
      >
        <div className={cn("h-full", isSidebarOpen ? "w-72" : "w-0 overflow-hidden")}>
           <TemplateBuilderSidebar
            activeTemplateType={activeTemplateType}
            onSelectTemplateType={setActiveTemplateType}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
          <header className="flex items-center gap-4 p-4 border-b">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                <PanelLeft />
                <span className="sr-only">Toggle sidebar</span>
             </Button>
             <div>
              <h1 className="text-xl font-semibold">Template Builder</h1>
              <p className="text-sm text-muted-foreground">Create, customize, and reuse templates across all rooms.</p>
             </div>
          </header>
          <div key={activeTemplateType} className="flex-1 h-full overflow-y-auto p-4 md:p-6">
            {renderContent()}
          </div>
      </div>
    </div>
  );
}
