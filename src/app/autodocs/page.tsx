"use client"
import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { ContentBriefDialog } from "./_components/content-brief-dialog";
import type { GenerateContentBriefOutput, DocumentType, SavedDocument, GenerateCallNoteOutput, SummarizeTranscriptOutput, GenerateSopOutput, CompareVersionsOutput } from "@/lib/types";
import { CallNoteDialog } from "./_components/call-note-dialog";
import { MeetingSummaryDialog } from "./_components/meeting-summary-dialog";
import { SopDialog } from "./_components/sop-dialog";
import { VersionComparisonDialog } from "./_components/version-comparison-dialog";
import { AutoDocsSidebar } from "./_components/autodocs-sidebar";
import { DocumentViewer } from "./_components/document-viewer";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AutoDocsPage() {
  const [documents, setDocuments] = React.useState<SavedDocument[]>([]);
  const [activeDocumentId, setActiveDocumentId] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  
  // Dialog states
  const [dialogState, setDialogState] = React.useState<{[key in DocumentType]?: boolean}>({});

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedDocs = localStorage.getItem("autodocs-documents");
      if (savedDocs) {
        const parsedDocs = JSON.parse(savedDocs);
        setDocuments(parsedDocs);
        if(parsedDocs.length > 0) {
            setActiveDocumentId(parsedDocs[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load documents from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("autodocs-documents", JSON.stringify(documents));
      } catch (error) {
        console.error("Failed to save documents to local storage", error);
      }
    }
  }, [documents, isMounted]);

  const openDialog = (type: DocumentType) => setDialogState({ ...dialogState, [type]: true });
  const closeDialog = (type: DocumentType) => setDialogState({ ...dialogState, [type]: false });


  const handleSaveDocument = (type: DocumentType, title: string, content: any) => {
    const newDoc: SavedDocument = {
      id: `doc-${Date.now()}`,
      type,
      title,
      createdAt: new Date().toISOString(),
      content,
    };
    const newDocuments = [newDoc, ...documents];
    setDocuments(newDocuments);
    setActiveDocumentId(newDoc.id);
    closeDialog(type);
  };
  
  const handleBriefGenerated = (brief: GenerateContentBriefOutput) => {
    const title = brief.hook.substring(0, 30) + "...";
    handleSaveDocument("Content Brief", title, brief);
  }

  const handleNoteGenerated = (note: GenerateCallNoteOutput) => {
    const title = "Call Note: " + note.summary.substring(0, 30) + "...";
    handleSaveDocument("Call Note", title, note);
  }
  
  const handleSummaryGenerated = (summary: SummarizeTranscriptOutput) => {
    handleSaveDocument("Meeting Summary", summary.title, summary);
  }

  const handleSopGenerated = (sop: GenerateSopOutput) => {
    handleSaveDocument("SOP", sop.title, sop);
  }
  
  const handleComparisonGenerated = (result: CompareVersionsOutput) => {
    const title = "Comparison: " + result.summary.substring(0, 30) + "...";
    handleSaveDocument("Version Comparison", title, result);
  }

  const handleDeleteDocument = (id: string) => {
    const newDocs = documents.filter(doc => doc.id !== id);
    setDocuments(newDocs);
    if (activeDocumentId === id) {
      setActiveDocumentId(newDocs.length > 0 ? newDocs[0].id : null);
    }
  }

  const activeDocument = documents.find(doc => doc.id === activeDocumentId) || null;

  if (!isMounted) return null;

  return (
    <div className="flex h-full">
       <ContentBriefDialog 
        open={!!dialogState["Content Brief"]}
        onOpenChange={(open) => !open && closeDialog("Content Brief")}
        onBriefGenerated={handleBriefGenerated}
      />
      <CallNoteDialog
        open={!!dialogState["Call Note"]}
        onOpenChange={(open) => !open && closeDialog("Call Note")}
        onNoteGenerated={handleNoteGenerated}
      />
      <MeetingSummaryDialog
        open={!!dialogState["Meeting Summary"]}
        onOpenChange={(open) => !open && closeDialog("Meeting Summary")}
        onSummaryGenerated={handleSummaryGenerated}
      />
      <SopDialog
        open={!!dialogState["SOP"]}
        onOpenChange={(open) => !open && closeDialog("SOP")}
        onSopGenerated={handleSopGenerated}
      />
       <VersionComparisonDialog
        open={!!dialogState["Version Comparison"]}
        onOpenChange={(open) => !open && closeDialog("Version Comparison")}
        onComparisonGenerated={handleComparisonGenerated}
      />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-72" : "w-0"
        )}
      >
        <div className={cn("h-full", isSidebarOpen ? "w-72" : "w-0 overflow-hidden")}>
           <AutoDocsSidebar
            documents={documents}
            activeDocumentId={activeDocumentId}
            onSelectDocument={setActiveDocumentId}
            onDeleteDocument={handleDeleteDocument}
            onNewDocument={openDialog}
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
          <DocumentViewer document={activeDocument} />
      </div>
    </div>
  );
}
