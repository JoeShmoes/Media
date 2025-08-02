
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Briefcase, Lightbulb, ListTodo, TrendingUp, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { useSettings } from "@/hooks/use-settings"

const chartData = [
  { month: "January", clients: 1, sales: 1200 },
  { month: "February", clients: 3, sales: 2800 },
  { month: "March", clients: 4, sales: 4500 },
  { month: "April", clients: 6, sales: 5800 },
  { month: "May", clients: 8, sales: 7200 },
  { month: "June", clients: 10, sales: 9800 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  clients: {
    label: "New Clients",
    color: "hsl(var(--chart-2))",
  },
}

export default function Dashboard() {
  const { settings } = useSettings();
  const cardClassName = settings.roomBackground === 'blur' ? "glassmorphic" : "";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cardClassName}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$31,389</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className={cardClassName}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className={cardClassName}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8</div>
            <p className="text-xs text-muted-foreground">+5 since last week</p>
          </CardContent>
        </Card>
        <Card className={cardClassName}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">3 urgent</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className={cn("col-span-4", cardClassName)}>
          <CardHeader>
            <CardTitle>Sales & Active Clients</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                  <Bar dataKey="clients" fill="var(--color-clients)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className={cn("col-span-4 lg:col-span-3", cardClassName)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              AI Daily Brief
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Client Follow-up:</span> You haven't heard from "Innovate Inc." in 3 days. Consider sending a re-engagement email.
              </p>
              <p>
                <span className="font-semibold text-foreground">Project Milestone:</span> "Alpha Website" is nearing its launch date. Plan the final review meeting.
              </p>
              <p>
                <span className="font-semibold text-foreground">Content Idea:</span> Your recent post on SEO trends performed well. Create a follow-up YouTube video script about "Advanced SEO hacks for 2024".
              </p>
               <p>
                <span className="font-semibold text-foreground">Outreach Opportunity:</span> A new startup, "QuantumLeap", just secured funding. They could be a good fit for your web creation services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
