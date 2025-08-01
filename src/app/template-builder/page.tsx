import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TemplateBuilderPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Template Builder">
        <Button><PlusCircle className="mr-2"/> Create New Template</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        Create, customize, and reuse templates across all rooms.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Task Templates</CardTitle>
            <CardDescription>Reusable project formats (e.g., launch sequence, outreach SOP).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Manage Task Templates</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Note Templates</CardTitle>
            <CardDescription>Formats for call notes, reflection journaling, or research.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Manage Note Templates</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Blueprint Templates</CardTitle>
            <CardDescription>Business plans, funnels, and onboarding flows.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Manage Blueprints</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Smart Variables</CardTitle>
            <CardDescription>Use placeholders like [Client Name] or [Due Date].</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Configure Variables</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Template Library</CardTitle>
            <CardDescription>Browse personal or community-contributed templates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Explore Library</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
