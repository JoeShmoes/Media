import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, DollarSign, LineChart, NotebookPen } from "lucide-react";

export default function DealRoomPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Deal Room" />
      <p className="text-muted-foreground">
        Negotiate, price, and close deals with dedicated tools.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign /> Proposal Generator</CardTitle>
            <CardDescription>Build and send interactive pricing pages or offers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Create Proposal</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSignature /> Contract Templates</CardTitle>
            <CardDescription>Use signable PDFs or embed e-signature integrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Templates</Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChart /> Revenue Forecast</CardTitle>
            <CardDescription>View potential earnings based on your current pipeline stage.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48 bg-muted/30 rounded-md">
             <p className="text-muted-foreground">Forecasting chart area</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><NotebookPen /> Notes & Objections Tracker</CardTitle>
            <CardDescription>Record and resolve prospect questions and objections.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">Open Objections Log</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
