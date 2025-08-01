import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function AutoDocsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="AutoDocs" />
      <p className="text-muted-foreground">
        Generate summaries, transcripts, briefs, or documentation automatically.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Meeting Recorder + AI Summary</CardTitle>
            <CardDescription>Upload recordings to auto-transcribe and summarize.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Upload Recording
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Call Note Generator</CardTitle>
            <CardDescription>Quickly enter post-call notes and let AI enhance them.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full">Create Call Note</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Content Brief Creator</CardTitle>
            <CardDescription>Outline blog or video briefs with AI assistance.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full">Create Content Brief</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>AutoDoc Templates</CardTitle>
            <CardDescription>Generate SOPs, policies, or training guides.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">New from Template</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Version Comparison</CardTitle>
            <CardDescription>Compare two summaries or notes with diff highlights.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full">Compare Documents</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
