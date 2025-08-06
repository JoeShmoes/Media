
"use client"

import * as React from "react";
import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { Briefcase, Lightbulb, ListTodo, TrendingUp, Users, DollarSign, Bell, Plus, PenSquare, Film, BarChart2, Zap, CheckCircle, ExternalLink, Activity, ServerCrash, LogIn } from "lucide-react"

import type { Deal, Project, Task, Transaction, TaskGroup, Note, Offer, BrandVoice, Persona, Goal, Client } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateDashboardInsights, type GenerateDashboardInsightsOutput } from "@/ai/flows/generate-dashboard-insights"
import { auth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/auth";
import { Icons } from "@/components/icons";
import { ProductTour } from "@/components/layout/product-tour";

const quickAccessItems = [
    { label: "New Task", icon: <Plus/>, href: "/tasks", selector: "#quick-access-tasks" },
    { label: "New Note", icon: <PenSquare/>, href: "/notes", selector: "#quick-access-notes" },
    { label: "Video Script", icon: <Film/>, href: "/youtube-studio", selector: "#quick-access-youtube" },
    { label: "Add Client", icon: <Users/>, href: "/clients", selector: "#quick-access-clients" },
    { label: "Generate Report", icon: <BarChart2/>, href: "/audit-room", selector: "#quick-access-audit" },
    { label: "Trigger Automation", icon: <Zap/>, href: "/integration-hub", selector: "#quick-access-integrations" },
]

const chartConfig = {
  tasks: {
    label: "Tasks Completed",
    color: "hsl(var(--chart-1))",
  },
}


export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const { settings } = useSettings();
  const cardClassName = "glassmorphic";
  const [isMounted, setIsMounted] = React.useState(false);
  
  // State for all dashboard data
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = React.useState(0);
  const [openDealsCount, setOpenDealsCount] = React.useState(0);
  const [tasksDueCount, setTasksDueCount] = React.useState(0);

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [brandVoice, setBrandVoice] = React.useState<BrandVoice | null>(null);
  const [personas, setPersonas] = React.useState<Persona[]>([]);
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  
  const [insights, setInsights] = React.useState<GenerateDashboardInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = React.useState(true);

  const loadData = React.useCallback(() => {
    if (!user) return;
    try {
        const savedTransactions = localStorage.getItem(`transactions_${user.uid}`);
        if(savedTransactions) {
            const txns: Transaction[] = JSON.parse(savedTransactions);
            setTransactions(txns);
            const income = txns.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
            setTotalRevenue(income);
        }

        const savedProjects = localStorage.getItem(`projects_${user.uid}`);
        if (savedProjects) {
            const projectsData: Project[] = Object.values(JSON.parse(savedProjects)).flat() as Project[];
            setProjects(projectsData);
            setActiveProjectsCount(projectsData.filter(p => p.status !== 'launch').length);
        }
        
        const savedDeals = localStorage.getItem(`deals_${user.uid}`);
        if (savedDeals) {
            const dealsData: Deal[] = JSON.parse(savedDeals);
            setDeals(dealsData);
            setOpenDealsCount(dealsData.filter(d => d.status !== 'closed-won' && d.status !== 'closed-lost').length);
        }
        
        const savedTasks = localStorage.getItem(`tasks_${user.uid}`);
        if (savedTasks) {
            const taskBoard: {groups: TaskGroup[]} = JSON.parse(savedTasks);
            const allTasks = taskBoard.groups.flatMap(g => g.tasks);
            setTasks(allTasks);
            setTasksDueCount(allTasks.filter(t => !t.completed).length);
        }
        
        const savedOffers = localStorage.getItem(`offers_${user.uid}`);
        if (savedOffers) setOffers(JSON.parse(savedOffers));

        const savedBrandVoice = localStorage.getItem(`brandVoice_${user.uid}`);
        if (savedBrandVoice) setBrandVoice(JSON.parse(savedBrandVoice));

        const savedPersonas = localStorage.getItem(`brandPersonas_${user.uid}`);
        if (savedPersonas) setPersonas(JSON.parse(savedPersonas));

        const savedGoals = localStorage.getItem(`cortex-goals_${user.uid}`);
        if (savedGoals) setGoals(JSON.parse(savedGoals));

        const savedNotes = localStorage.getItem(`notes_${user.uid}`);
        if (savedNotes) setNotes(JSON.parse(savedNotes));

        const savedClients = localStorage.getItem(`clients_${user.uid}`);
        if (savedClients) setClients(JSON.parse(savedClients));

      } catch (error) {
          console.error("Failed to load dashboard data from local storage", error);
      }
  }, [user]);

  React.useEffect(() => {
      setIsMounted(true);
      loadData();
      
      const handleStorageChange = (event: StorageEvent) => {
        loadData();
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
          window.removeEventListener('storage', handleStorageChange);
      }
  }, [loadData]);
  
  React.useEffect(() => {
    if (!isMounted || !user) return;

    const fetchInsights = async () => {
        setIsLoadingInsights(true);
        try {
            const result = await generateDashboardInsights({
                projects: projects.map(p => ({id: p.id, title: p.title, status: p.status, deadline: p.deadline})),
                deals: deals.map(d => ({id: d.id, title: d.title, status: d.status, value: d.value, clientName: d.clientName})),
                tasks: tasks.filter(t => !t.completed).map(t => ({id: t.id, name: t.name, completed: t.completed, dueDate: t.dueDate})),
                offers: offers.map(o => ({ id: o.id, title: o.title, price: o.price })),
                brandVoice: brandVoice || undefined,
                personas: personas.map(p => ({ name: p.name, bio: p.bio })),
                goals: goals.map(g => ({ id: g.id, title: g.title, status: g.status })),
                notes: notes.slice(0, 5).map(n => ({ id: n.id, title: n.title, content: n.content.substring(0, 100) })),
                clients: clients.map(c => ({ id: c.id, name: c.name, status: c.status })),
                transactions: transactions.slice(0, 10).map(t => ({ id: t.id, type: t.type, amount: t.amount, category: t.category })),
            });
            setInsights(result);
        } catch (error) {
            console.error("Failed to generate dashboard insights", error);
            setInsights({
                suggestions: [{ text: "Could not load AI suggestions.", href: "#" }],
                notifications: [{ text: "Error fetching AI insights.", level: "critical" }]
            });
        } finally {
            setIsLoadingInsights(false);
        }
    }
    
    fetchInsights();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, user]);

  const kpiData = [
    { metric: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign/>, selector: "#kpi-revenue" },
    { metric: "Active Projects", value: `${activeProjectsCount}`, icon: <Briefcase/>, selector: "#kpi-projects" },
    { metric: "Open Deals", value: `${openDealsCount}`, icon: <Users/>, selector: "#kpi-deals" },
    { metric: "Tasks Due", value: `${tasksDueCount}`, icon: <ListTodo/>, selector: "#kpi-tasks" },
  ]
  
  const performanceChartData = React.useMemo(() => {
    const last30Days = eachDayOfInterval({
        start: subDays(new Date(), 29),
        end: new Date()
    });

    const completedTasksByDate = tasks
        .filter(task => task.completed && task.dueDate)
        .reduce((acc, task) => {
            try {
                const completedDate = format(new Date(task.dueDate!), 'yyyy-MM-dd');
                acc[completedDate] = (acc[completedDate] || 0) + 1;
            } catch (e) {
                // Ignore tasks with invalid dates
            }
            return acc;
        }, {} as Record<string, number>);

    return last30Days.map(date => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        return {
            date: formattedDate,
            tasks: completedTasksByDate[formattedDate] || 0
        };
    });
  }, [tasks]);

  
  if (!isMounted) {
    return null; // or a loading screen
  }

  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <ProductTour/>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {/* Left & Center Columns */}
              <div className="lg:col-span-3 xl:col-span-4 space-y-6">
                  <Card className={cn("col-span-4", cardClassName)} id="tour-kpis">
                      <CardHeader>
                          <CardTitle>Today's Command Center</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {kpiData.map(kpi => (
                              <Card key={kpi.metric} id={kpi.selector.substring(1)} className="bg-muted/30">
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                      <CardTitle className="text-sm font-medium">{kpi.metric}</CardTitle>
                                      <div className="h-4 w-4 text-muted-foreground">{kpi.icon}</div>
                                  </CardHeader>
                                  <CardContent>
                                      <div className="text-2xl font-bold">{kpi.value}</div>
                                  </CardContent>
                              </Card>
                          ))}
                      </CardContent>
                  </Card>

                  <Card className={cn("col-span-4", cardClassName)}>
                      <CardHeader>
                          <CardTitle>Quick Access Launcher</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {quickAccessItems.map(item => (
                              <Link href={item.href} key={item.label} passHref id={item.selector.substring(1)}>
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
                          <CardDescription>Tasks completed over the last 30 days based on your input.</CardDescription>
                      </CardHeader>
                      <CardContent className="pl-2 h-64">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                              <ResponsiveContainer>
                                  <LineChart data={performanceChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                      <CartesianGrid vertical={false} />
                                      <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {day: 'numeric'})} tickLine={false} axisLine={false}/>
                                      <YAxis tickLine={false} axisLine={false} />
                                      <Tooltip content={<ChartTooltipContent indicator="dot" />} cursor={false}/>
                                      <Line type="monotone" dataKey="tasks" stroke="var(--color-tasks)" strokeWidth={2} dot={false}/>
                                  </LineChart>
                              </ResponsiveContainer>
                          </ChartContainer>
                      </CardContent>
                  </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 xl:col-span-1 space-y-6">
                  <Card className={cn("col-span-4 lg:col-span-3", cardClassName)} id="tour-suggestions">
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
                                  <p key={index}>
                                    {index + 1}. <Link href={suggestion.href} className="text-primary hover:underline">{suggestion.text}</Link>
                                  </p>
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
              </div>
          </div>
      </div>
  )
}
