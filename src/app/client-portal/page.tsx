import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, MessageCircle, Upload, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ClientPortalPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Client Portal">
        <Button variant="outline"><Settings className="mr-2"/> Portal Settings</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        Give clients access to their own information and project status.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="Innovate Inc." data-ai-hint="company logo"/>
                <AvatarFallback>II</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Innovate Inc. Portal</CardTitle>
                <CardDescription>SEO Project</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
             <Button className="w-full justify-between">View Dashboard <LinkIcon/></Button>
             <Button variant="secondary" className="w-full justify-between">Send Message <MessageCircle/></Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
             <CardTitle>Resource Center</CardTitle>
            <CardDescription>Upload and organize client documents and videos.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full">
                <Upload className="mr-2"/> Upload File
             </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Permissions & Views</CardTitle>
            <CardDescription>Control what each client sees and can interact with.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Permissions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
