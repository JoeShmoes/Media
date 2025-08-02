"use client"

import { PageHeader } from "@/components/page-header";
import { CaptionCrafter } from "./_components/caption-crafter";

export default function WritingLabPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Writing Lab" />
      <p className="text-muted-foreground">
        A creative writing space supercharged by AI. Use the Caption Crafter below to generate content for your social media.
      </p>
      <CaptionCrafter />
    </div>
  );
}
