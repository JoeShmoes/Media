
"use client"

import * as React from "react";
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts"
import { Briefcase, Lightbulb, ListTodo, TrendingUp, Users, DollarSign, Bell, Plus, PenSquare, Film, BarChart2, Zap, CheckCircle, ExternalLink, Activity, ServerCrash } from "lucide-react"

import type { Deal, Project, Task, Transaction, TaskGroup, Note } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateDashboardInsights, type GenerateDashboardInsightsOutput } from "@/ai/flows/generate-dashboard-insights"

const quickAccessItems = [
    { label: "New Task", icon: <Plus/>, href: "/tasks" },
    { label: "New Note", icon: <PenSquare/>, href: "/notes" },
    { label: "Video Script", icon: <Film/>, href: "/youtube-studio" },
    { label: "Add Client", icon: <Users/>, href: "/clients" },
    { label: "Generate Report", icon: <BarChart2/>, href: "/audit-room" },
    { label: "Trigger Automation", icon: <Zap/>, href: "/integration-hub" },
]

const chartData = [
  { date: "2024-05-01", tasks: 22 }, { date: "2024-05-02", tasks: 25 },
  { date: "2024-05-03", tasks: 18 }, { date: "2024-05-04", tasks: 30 },
  { date: "2024-05-05", tasks: 27 }, { date: "2024-05-06", tasks: 32 },
  { date: "2024-05-07", tasks: 29 },
];

const chartConfig = {
  tasks: {
    label: "Tasks Completed",
    color: "hsl(var(--chart-1))",
  },
}


export default function Dashboard() {
  const { settings } = useSettings();
  const cardClassName = "glassmorphic";
  const [isMounted, setIsMounted] = React.useState(false);
  
  // State for dashboard data
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [activeProjects, setActiveProjects] = React.useState<Project[]>([]);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  
  const [insights, setInsights] = React.useState<GenerateDashboardInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = React.useState(true);


  React.useEffect(() => {
      setIsMounted(true);
      try {
        const savedTransactions = localStorage.getItem("transactions");
        if(savedTransactions) {
            const transactions: Transaction[] = JSON.parse(savedTransactions);
            const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            setTotalRevenue(income);
        }

        const savedProjects = localStorage.getItem("projects");
        if (savedProjects) {
            const projects: Project[] = Object.values(JSON.parse(savedProjects)).flat() as Project[];
            setActiveProjects(projects.filter(p => p.status !== 'launch'));
        }
        
        const savedDeals = localStorage.getItem("deals");
        if (savedDeals) {
            setDeals(JSON.parse(savedDeals));
        }
        
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            const taskBoard: {groups: TaskGroup[]} = JSON.parse(savedTasks);
            const allTasks = taskBoard.groups.flatMap(g => g.tasks);
            setTasks(allTasks.filter(t => !t.completed));
        }

      } catch (error) {
          console.error("Failed to load dashboard data from local storage", error);
      }
  }, []);
  
  React.useEffect(() => {
    if (!isMounted) return;

    const fetchInsights = async () => {
        setIsLoadingInsights(true);
        try {
            const result = await generateDashboardInsights({
                projects: activeProjects.map(p => ({id: p.id, title: p.title, status: p.status, deadline: p.deadline})),
                deals: deals.map(d => ({id: d.id, title: d.title, status: d.status, value: d.value, clientName: d.clientName})),
                tasks: tasks.map(t => ({id: t.id, name: t.name, completed: t.completed})),
            });
            setInsights(result);
        } catch (error) {
            console.error("Failed to generate dashboard insights", error);
            // Set some default state on error
            setInsights({
                suggestions: ["Could not load AI suggestions."],
                notifications: [{ text: "Error fetching AI insights.", level: "critical" }]
            });
        } finally {
            setIsLoadingInsights(false);
        }
    }
    fetchInsights();

  }, [isMounted, activeProjects, deals, tasks]);

  const kpiData = [
    { metric: "Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+20.1%", icon: <DollarSign/> },
    { metric: "Active Projects", value: `+${activeProjects.length}`, change: "+5 since last week", icon: <Briefcase/> },
    { metric: "Leads This Week", value: `${deals.filter(d => d.status === 'leads').length}`, change: "+12%", icon: <Users/> },
    { metric: "Tasks Due", value: `${tasks.length}`, change: "3 urgent", icon: <ListTodo/> },
  ]
  
  if (!isMounted) {
    return null; // or a loading skeleton
  }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {/* Left & Center Columns */}
            <div className="lg:col-span-3 xl:col-span-4 space-y-6">
                <Card className={cn("col-span-4", cardClassName)}>
                    <CardHeader>
                        <CardTitle>Today's Command Center</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {kpiData.map(kpi => (
                             <Card key={kpi.metric} className="bg-muted/30">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{kpi.metric}</CardTitle>
                                    <div className="h-4 w-4 text-muted-foreground">{kpi.icon}</div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpi.value}</div>
                                    <p className="text-xs text-muted-foreground">{kpi.change}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                     <CardContent className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-muted/30">
                            <CardHeader><CardTitle className="text-base">Today's Calendar</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-sm text-center text-muted-foreground py-8">Calendar view coming soon</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/30">
                            <CardHeader><CardTitle className="text-base">Daily Priorities</CardTitle></CardHeader>
                             <CardContent>
                                <div className="text-sm text-center text-muted-foreground py-8">Drag & drop tasks here</div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                 <Card className={cn("col-span-4", cardClassName)}>
                    <CardHeader>
                        <CardTitle>Quick Access Launcher</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {quickAccessItems.map(item => (
                            <Link href={item.href} key={item.label} passHref>
                                <Button variant="outline" className="flex-col h-20 w-full">
                                    {item.icon}
                                    <span className="mt-1 text-xs">{item.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
                
                 <Card className={cn("col-span-4", cardClassName)}>
                    <CardHeader>
                        <CardTitle>Performance Tracker</CardTitle>
                         <CardDescription>Tasks completed over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2 h-64">
                       <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer>
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {day: 'numeric'})} tickLine={false} axisLine={false}/>
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTooltipContent />} cursor={false}/>
                                    <Line type="monotone" dataKey="tasks" stroke="var(--color-tasks)" strokeWidth={2} dot={false}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 xl:col-span-1 space-y-6">
                <Card className={cn("col-span-4 lg:col-span-3", cardClassName)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-400" /> Assistant Suggestions</CardTitle>
                    <CardDescription>Your top 3 growth moves this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingInsights ? (
                        <p className="text-sm text-muted-foreground">Generating suggestions...</p>
                    ) : (
                        <div className="space-y-4 text-sm text-muted-foreground">
                            {insights?.suggestions.map((suggestion, index) => (
                                <p key={index}>{index + 1}. <a href="#" className="text-primary hover:underline">{suggestion}</a></p>
                            ))}
                        </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className={cardClassName}>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Bell/> Notifications & Alerts</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                         {isLoadingInsights ? (
                            <p className="text-sm text-muted-foreground">Loading alerts...</p>
                         ) : (
                             insights?.notifications.map((n, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={cn("h-2 w-2 rounded-full mt-1.5", n.level === 'critical' ? 'bg-red-500' : n.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500')} />
                                    <p className="text-sm text-muted-foreground">{n.text}</p>
                                </div>
                            ))
                         )}
                    </CardContent>
                </Card>

                 <Card className={cardClassName}>
                    <CardHeader><CardTitle>Favourites</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-sm text-center text-muted-foreground py-8">Pin anything here</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
