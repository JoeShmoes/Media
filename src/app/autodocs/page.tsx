
"use client"
import * as React from "react";
import { AutoDocsSidebar } from "./_components/autodocs-sidebar";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DocumentType } from "@/lib/types";
import { SummarizeTranscriptView } from "./_components/summarize-transcript-view";
import { CallNoteView } from "./_components/call-note-view";
import { ContentBriefView } from "./_components/content-brief-view";
import { SopView } from "./_components/sop-view";
import { VersionComparisonView } from "./_components/version-comparison-view";


export default function AutoDocsPage() {
  const [activeService, setActiveService] = React.useState<DocumentType>("Meeting Summary");
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderContent = () => {
    switch (activeService) {
      case "Meeting Summary":
        return <SummarizeTranscriptView />;
      case "Call Note":
        return <CallNoteView />;
      case "Content Brief":
        return <ContentBriefView />;
      case "SOP":
        return <SopView />;
      case "Version Comparison":
        return <VersionComparisonView />;
      default:
        return <p>Select a service to begin.</p>;
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
           <AutoDocsSidebar
            activeService={activeService}
            onSelectService={setActiveService}
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
              <h1 className="text-xl font-semibold">AutoDocs</h1>
              <p className="text-sm text-muted-foreground">Generate summaries, briefs, or documentation automatically.</p>
             </div>
          </header>
          <div className="flex-1 h-full overflow-y-auto p-4 md:p-6">
            {renderContent()}
          </div>
      </div>
    </div>
  );
}
