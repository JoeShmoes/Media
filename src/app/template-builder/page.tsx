
"use client"

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, LayoutTemplate, Share2, Variable } from "lucide-react";

export default function TemplateBuilderPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Template Builder">
        {/* This button could eventually open a dialog to choose which template type to create */}
      </PageHeader>
      <p className="text-muted-foreground">
        Create, customize, and reuse templates across all rooms.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LayoutTemplate /> Task Templates</CardTitle>
            <CardDescription>Reusable project formats (e.g., launch sequence, outreach SOP).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/template-builder/tasks">Manage Task Templates</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Note Templates</CardTitle>
            <CardDescription>Formats for call notes, reflection journaling, or research.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="secondary" className="w-full" asChild>
                <Link href="/template-builder/notes">Manage Note Templates</Link>
            </Button>
          </CardContent>
        </Card>
         <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Variable/> Smart Variables</CardTitle>
            <CardDescription>Use placeholders like [Client Name] or [Due Date].</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>Configure Variables</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Share2 /> Template Library</CardTitle>
            <CardDescription>Browse personal or community-contributed templates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>Explore Library</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
