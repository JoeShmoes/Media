
"use client"
import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { ContentBriefDialog } from "./_components/content-brief-dialog";
import type { GenerateContentBriefOutput } from "@/ai/flows/generate-content-brief";
import { ContentBriefDisplay } from "./_components/content-brief-display";
import { CallNoteDialog } from "./_components/call-note-dialog";
import type { GenerateCallNoteOutput } from "@/ai/flows/generate-call-note";
import { CallNoteDisplay } from "./_components/call-note-display";
import { MeetingSummaryDialog } from "./_components/meeting-summary-dialog";
import type { SummarizeTranscriptOutput } from "@/ai/flows/summarize-transcript";
import { MeetingSummaryDisplay } from "./_components/meeting-summary-display";
import { SopDialog } from "./_components/sop-dialog";
import type { GenerateSopOutput } from "@/ai/flows/generate-sop";
import { SopDisplay } from "./_components/sop-display";
import { VersionComparisonDialog } from "./_components/version-comparison-dialog";
import type { CompareVersionsOutput } from "@/ai/flows/compare-versions";
import { VersionComparisonDisplay } from "./_components/version-comparison-display";

export default function AutoDocsPage() {
  const [isBriefDialogOpen, setIsBriefDialogOpen] = React.useState(false);
  const [generatedBrief, setGeneratedBrief] = React.useState<GenerateContentBriefOutput | null>(null);

  const [isCallNoteDialogOpen, setIsCallNoteDialogOpen] = React.useState(false);
  const [generatedCallNote, setGeneratedCallNote] = React.useState<GenerateCallNoteOutput | null>(null);

  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = React.useState(false);
  const [generatedSummary, setGeneratedSummary] = React.useState<SummarizeTranscriptOutput | null>(null);

  const [isSopDialogOpen, setIsSopDialogOpen] = React.useState(false);
  const [generatedSop, setGeneratedSop] = React.useState<GenerateSopOutput | null>(null);
  
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = React.useState(false);
  const [comparisonResult, setComparisonResult] = React.useState<CompareVersionsOutput | null>(null);

  const clearAllOutputs = () => {
    setGeneratedBrief(null);
    setGeneratedCallNote(null);
    setGeneratedSummary(null);
    setGeneratedSop(null);
    setComparisonResult(null);
  }

  const handleBriefGenerated = (brief: GenerateContentBriefOutput) => {
    clearAllOutputs();
    setGeneratedBrief(brief);
  }

  const handleNoteGenerated = (note: GenerateCallNoteOutput) => {
    clearAllOutputs();
    setGeneratedCallNote(note);
  }
  
  const handleSummaryGenerated = (summary: SummarizeTranscriptOutput) => {
    clearAllOutputs();
    setGeneratedSummary(summary);
  }

  const handleSopGenerated = (sop: GenerateSopOutput) => {
    clearAllOutputs();
    setGeneratedSop(sop);
  }
  
  const handleComparisonGenerated = (result: CompareVersionsOutput) => {
    clearAllOutputs();
    setComparisonResult(result);
  }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ContentBriefDialog 
        open={isBriefDialogOpen}
        onOpenChange={setIsBriefDialogOpen}
        onBriefGenerated={handleBriefGenerated}
      />
      
      <CallNoteDialog
        open={isCallNoteDialogOpen}
        onOpenChange={setIsCallNoteDialogOpen}
        onNoteGenerated={handleNoteGenerated}
      />
      
      <MeetingSummaryDialog
        open={isSummaryDialogOpen}
        onOpenChange={setIsSummaryDialogOpen}
        onSummaryGenerated={handleSummaryGenerated}
      />

      <SopDialog
        open={isSopDialogOpen}
        onOpenChange={setIsSopDialogOpen}
        onSopGenerated={handleSopGenerated}
      />
      
       <VersionComparisonDialog
        open={isComparisonDialogOpen}
        onOpenChange={setIsComparisonDialogOpen}
        onComparisonGenerated={handleComparisonGenerated}
      />

      <PageHeader title="AutoDocs" />
      <p className="text-muted-foreground">
        Generate summaries, transcripts, briefs, or documentation automatically.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Meeting Recorder + AI Summary</CardTitle>
            <CardDescription>Paste a transcript to auto-summarize the conversation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setIsSummaryDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" /> Summarize Transcript
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Call Note Generator</CardTitle>
            <CardDescription>Quickly enter post-call notes and let AI enhance them.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full" onClick={() => setIsCallNoteDialogOpen(true)}>Create Call Note</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Content Brief Creator</CardTitle>
            <CardDescription>Outline blog or video briefs with AI assistance.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full" onClick={() => setIsBriefDialogOpen(true)}>Create Content Brief</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>AutoDoc Templates</CardTitle>
            <CardDescription>Generate SOPs, policies, or training guides.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setIsSopDialogOpen(true)}>Generate SOP</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Version Comparison</CardTitle>
            <CardDescription>Compare two summaries or notes with diff highlights.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full" onClick={() => setIsComparisonDialogOpen(true)}>Compare Documents</Button>
          </CardContent>
        </Card>
      </div>
      
      {generatedBrief && <ContentBriefDisplay brief={generatedBrief} />}
      {generatedCallNote && <CallNoteDisplay note={generatedCallNote} />}
      {generatedSummary && <MeetingSummaryDisplay summary={generatedSummary} />}
      {generatedSop && <SopDisplay sop={generatedSop} />}
      {comparisonResult && <VersionComparisonDisplay result={comparisonResult} />}
    </div>
  );
}
