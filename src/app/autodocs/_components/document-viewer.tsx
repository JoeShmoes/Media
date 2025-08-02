"use client"

import * as React from "react"
import type { SavedDocument } from "@/lib/types"
import { ContentBriefDisplay } from "./content-brief-display"
import { CallNoteDisplay } from "./call-note-display"
import { MeetingSummaryDisplay } from "./meeting-summary-display"
import { SopDisplay } from "./sop-display"
import { VersionComparisonDisplay } from "./version-comparison-display"

interface DocumentViewerProps {
  document: SavedDocument | null
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className="flex-1 flex justify-center items-center h-full text-muted-foreground">
        <p>Select a document from the sidebar or create a new one.</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (document.type) {
      case "Content Brief":
        return <ContentBriefDisplay brief={document.content} />
      case "Call Note":
        return <CallNoteDisplay note={document.content} />
      case "Meeting Summary":
        return <MeetingSummaryDisplay summary={document.content} />
      case "SOP":
        return <SopDisplay sop={document.content} />
      case "Version Comparison":
        return <VersionComparisonDisplay result={document.content} />
      default:
        return <p>Unknown document type.</p>
    }
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-6">
        {renderContent()}
    </div>
  )
}
