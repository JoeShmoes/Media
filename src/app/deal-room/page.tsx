
"use client"

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, DollarSign, LineChart, NotebookPen } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
}

// NOTE: In a real app, this data would come from a database or state management.
// We are hardcoding it here to match the data in pipeline-tracker.
const boardData = {
    leads: [
      { id: "lead-1", title: "Prospect from Website", value: 2500 },
      { id: "lead-2", title: "Referral from Synergy", value: 5000 },
    ],
    "needs-analysis": [
      { id: "need-1", title: "Initial call with Apex", value: 10000 },
    ],
    proposal: [
      { id: "prop-1", title: "Send proposal to Innovate Inc.", value: 7500, status: "Hot" },
    ],
    negotiation: [],
    closed: [
      { id: "closed-1", title: "Won: QuantumLeap Deal", value: 15000, status: "Won" },
    ],
};

const forecastData = [
    { stage: "Leads", value: boardData.leads.reduce((acc, deal) => acc + deal.value, 0) },
    { stage: "Needs Analysis", value: boardData["needs-analysis"].reduce((acc, deal) => acc + deal.value, 0) },
    { stage: "Proposal", value: boardData.proposal.reduce((acc, deal) => acc + deal.value, 0) }
]


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
            <Button className="w-full" asChild>
                <Link href="/offer-builder">Create Proposal</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSignature /> Contract Templates</CardTitle>
            <CardDescription>Use signable PDFs or embed e-signature integrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/asset-tracker">Manage Templates</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChart /> Revenue Forecast</CardTitle>
            <CardDescription>View potential earnings based on your current pipeline stage.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer>
                <BarChart data={forecastData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="stage" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                  <ChartTooltip 
                    cursor={false}
                    content={<ChartTooltipContent 
                        formatter={(value) => `$${value.toLocaleString()}`}
                    />} 
                   />
                  <Bar dataKey="value" fill="var(--color-value)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><NotebookPen /> Notes & Objections Tracker</CardTitle>
            <CardDescription>Record and resolve prospect questions and objections.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full" asChild>
                <Link href="/notes">Open Objections Log</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
