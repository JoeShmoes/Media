import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Palette, FileText, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AssetTrackerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Asset Tracker" />
      <p className="text-muted-foreground">
        A central vault for all your digital and brand assets.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glassmorphic md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Search</CardTitle>
            <CardDescription>Ask questions like: "Where’s my latest pitch deck?" or "Find all logos for Project X."</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Search your assets..." />
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe /> Domains & Tools</CardTitle>
            <CardDescription>Log and manage licenses and expiration dates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Domains</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette /> Design Library</CardTitle>
            <CardDescription>Store logos, fonts, colors, and mockups.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Design Library</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Legal Docs</CardTitle>
            <CardDescription>A secure place for contracts, NDAs, and templates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Access Legal Documents</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
