import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, PackageCheck, GitCompareArrows, BarChart3 } from "lucide-react";

export default function OfferBuilderPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Offer Builder">
        <Button><PlusCircle className="mr-2"/> New Offer</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        Visually develop and test new products or services.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Value Proposition Canvas</CardTitle>
            <CardDescription>Map out pain points, gains, and solutions for your target audience.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Open Canvas</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PackageCheck /> Stack Builder</CardTitle>
            <CardDescription>Build and present your offer stack with all its components visually.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button className="w-full">Build a Stack</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GitCompareArrows /> Price Testing</CardTitle>
            <CardDescription>Create A/B comparisons for different price points or packages.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="secondary" className="w-full">New Price Test</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 /> Offer Tracker</CardTitle>
            <CardDescription>Track the performance of your offers across different audience segments.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
             <p className="text-muted-foreground">Offer performance charts will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
