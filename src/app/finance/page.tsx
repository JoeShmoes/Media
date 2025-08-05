
"use client"
import * as React from "react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { format, parseISO } from "date-fns"
import { PlusCircle, TrendingDown, TrendingUp, DollarSign, Download } from "lucide-react"
import { CSVLink } from "react-csv";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/types"
import { TransactionDialog } from "./_components/transaction-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/hooks/use-settings"
import { useToast } from "@/hooks/use-toast"

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
  income: {
      label: "Income",
      color: "hsl(var(--chart-1))"
  },
  expense: {
      label: "Expense",
      color: "hsl(var(--chart-3))"
  }
}

export default function FinancePage() {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);
    const csvLinkRef = React.useRef<any>(null);
    const { settings } = useSettings();
    const { toast } = useToast();

    React.useEffect(() => {
        setIsMounted(true);
        try {
            const savedTransactions = localStorage.getItem("transactions");
            if (savedTransactions) {
                setTransactions(JSON.parse(savedTransactions));
            } else {
                // If there are no saved transactions, it's a new user or cleared storage.
                // We set the flag to indicate the finance room has been initialized.
                // This ensures they start at $0 without being prompted.
                 localStorage.setItem("hasInitializedFinance", "true");
            }
        } catch (error) {
            console.error("Failed to load data from local storage", error);
        }
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem("transactions", JSON.stringify(transactions));
            } catch (error) {
                console.error("Failed to save transactions to local storage", error);
            }
        }
    }, [transactions, isMounted]);

    const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...data,
            id: `txn-${Date.now()}`
        }
        setTransactions(prev => [...prev, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    
    const handleExport = () => {
        const format = settings.exportOptions;
        if (format === 'csv') {
            csvLinkRef.current?.link.click();
        } else {
          toast({
            title: "Export Not Implemented",
            description: `Exporting as ${format.toUpperCase()} is not yet supported.`,
          })
        }
    }

    const { totalIncome, totalExpenses, totalProfit, monthlyProfit, chartData } = React.useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const profit = income - expenses;

        const monthlyData: {[key: string]: { income: number, expenses: number }} = {};
        
        transactions.forEach(t => {
            const month = format(parseISO(t.date), 'yyyy-MM');
            if(!monthlyData[month]) {
                monthlyData[month] = { income: 0, expenses: 0 };
            }
            if (t.type === 'income') {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expenses += t.amount;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const chartData = sortedMonths.map(month => ({
            month: format(parseISO(`${month}-01`), 'MMM yy'),
            income: monthlyData[month].income,
            expenses: monthlyData[month].expenses,
            profit: monthlyData[month].income - monthlyData[month].expenses,
        }));
        
        const currentMonthKey = format(new Date(), 'yyyy-MM');
        const currentMonthProfit = monthlyData[currentMonthKey] ? monthlyData[currentMonthKey].income - monthlyData[currentMonthKey].expenses : 0;

        return { totalIncome: income, totalExpenses: expenses, totalProfit: profit, monthlyProfit: currentMonthProfit, chartData };
    }, [transactions]);
    
    if (!isMounted) {
        return null;
    }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-end gap-2">
          <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2"/> Add Transaction
          </Button>
          <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2"/> Export as {settings.exportOptions.toUpperCase()}
          </Button>
          <CSVLink 
              data={transactions} 
              filename={"transactions.csv"}
              className="hidden"
              ref={csvLinkRef}
              target="_blank"
          />
      </div>
      
       <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleAddTransaction}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Total Income</CardTitle>
            <TrendingUp className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Total Expenses</CardTitle>
             <TrendingDown className="text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle>Net Profit</CardTitle>
            <DollarSign />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">${totalProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {settings.showProfitLossChart && (
            <Card className="col-span-4 glassmorphic">
                <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="expenses" stroke="var(--color-expense)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        )}
        <Card className={settings.showProfitLossChart ? "col-span-4 lg:col-span-3 glassmorphic" : "col-span-full glassmorphic"}>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your last 5 transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.slice(0, 5).map(t => (
                        <TableRow key={t.id}>
                            <TableCell>
                                <p className="font-medium">{t.description}</p>
                                <p className="text-xs text-muted-foreground">{t.category}</p>
                            </TableCell>
                            <TableCell>{format(parseISO(t.date), "dd MMM, yyyy")}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={t.type === 'income' ? 'default' : 'destructive'} className="bg-opacity-20 text-opacity-100">
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                     {transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                No transactions yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
