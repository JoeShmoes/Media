import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Split, Mic, History, Bot } from "lucide-react";

export default function WritingLabPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Writing Lab" />
      <p className="text-muted-foreground">
        A creative writing space supercharged by AI.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> AI Writing Tools</CardTitle>
            <CardDescription>Blog Builder, Caption Crafter, and Headline Split-Tester.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start">New Blog Post</Button>
            <Button variant="secondary" className="w-full justify-start">Generate Captions</Button>
            <Button variant="secondary" className="w-full justify-start">Test Headlines</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mic /> Style Trainer</CardTitle>
            <CardDescription>Train your unique tone of voice into the AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Start Training</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History /> Content History</CardTitle>
            <CardDescription>Store and access drafts, versions, and final posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">View History</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Split /> Prompt Builder</CardTitle>
            <CardDescription>Design repeatable writing prompts (e.g., a LinkedIn post every Tuesday).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Create New Prompt</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
