import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function PipelineTrackerPage() {
  const boardData = {
    leads: [
      { id: "lead-1", title: "Prospect from Website", value: "$2,500" },
      { id: "lead-2", title: "Referral from Synergy", value: "$5,000" },
    ],
    "needs-analysis": [
      { id: "need-1", title: "Initial call with Apex", value: "$10,000" },
    ],
    proposal: [
      { id: "prop-1", title: "Send proposal to Innovate Inc.", value: "$7,500", status: "Hot" },
    ],
    negotiation: [],
    closed: [
      { id: "closed-1", title: "Won: QuantumLeap Deal", value: "$15,000", status: "Won" },
    ],
  };

  type BoardColumn = keyof typeof boardData;

  const columnTitles: Record<BoardColumn, string> = {
    leads: "New Leads",
    "needs-analysis": "Needs Analysis",
    proposal: "Proposal Sent",
    negotiation: "Negotiation",
    closed: "Closed-Won/Lost",
  };

  const statusColors: { [key: string]: string } = {
    Hot: "bg-red-500",
    Won: "bg-green-500",
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Sales Pipeline Tracker">
        <Button><PlusCircle className="mr-2"/> Add New Deal</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        Visual status boards for your sales deals.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {(Object.keys(boardData) as BoardColumn[]).map((columnKey) => (
          <div key={columnKey} className="bg-muted/40 rounded-lg p-2">
            <h2 className="text-lg font-semibold mb-4 px-2">{columnTitles[columnKey]}</h2>
            <div className="space-y-3">
              {boardData[columnKey].map((task) => (
                <Card key={task.id} className="glassmorphic">
                  <CardContent className="p-3">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.value}</p>
                    {task.status && (
                       <span className={`mt-2 inline-block w-3 h-3 rounded-full ${statusColors[task.status]}`} title={task.status} />
                    )}
                  </CardContent>
                </Card>
              ))}
               {boardData[columnKey].length === 0 && <div className="h-10"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
