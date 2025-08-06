
"use client"
import * as React from "react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { format, parseISO } from "date-fns"
import { PlusCircle, TrendingDown, TrendingUp, DollarSign, Download, MoreHorizontal, Trash2 } from "lucide-react"
import { CSVLink } from "react-csv";
import { useAuthState } from "react-firebase-hooks/auth";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow } from 'docx';
import { saveAs } from 'file-saver';

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { auth } from "@/lib/firebase";

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
    const [user] = useAuthState(auth);
    const csvLinkRef = React.useRef<any>(null);
    const { settings } = useSettings();
    const { toast } = useToast();
    const tableRef = React.useRef<HTMLTableElement>(null);

    React.useEffect(() => {
        setIsMounted(true);
        if (!user) return;
        try {
            const savedTransactions = localStorage.getItem(`transactions_${user.uid}`);
            if (savedTransactions) {
                setTransactions(JSON.parse(savedTransactions));
            }
        } catch (error) {
            console.error("Failed to load data from local storage", error);
        }
    }, [user]);

    React.useEffect(() => {
        if (isMounted && user) {
            try {
                localStorage.setItem(`transactions_${user.uid}`, JSON.stringify(transactions));
            } catch (error) {
                console.error("Failed to save transactions to local storage", error);
            }
        }
    }, [transactions, isMounted, user]);

    const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...data,
            id: `txn-${Date.now()}`
        }
        setTransactions(prev => [...prev, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    
    const handleDeleteTransaction = (transactionId: string) => {
        setTransactions(transactions.filter(t => t.id !== transactionId));
    }

    const handleExport = async () => {
        toast({
            title: "Exporting Data",
            description: `Your transactions data is being downloaded as a .${settings.exportOptions} file.`,
        });

        switch (settings.exportOptions) {
            case 'csv':
                csvLinkRef.current?.link.click();
                break;
            case 'pdf':
                const doc = new jsPDF();
                doc.text("Transactions", 14, 16);
                autoTable(doc, { html: '#transactions-table' });
                doc.save('transactions.pdf');
                break;
            case 'png':
                 if (tableRef.current) {
                    const canvas = await html2canvas(tableRef.current);
                    const dataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'transactions.png';
                    link.click();
                }
                break;
            case 'docx':
                 const docx = new Document({
                    sections: [{
                        children: [
                            new Paragraph({ text: "Transactions", heading: 'Heading1' }),
                            new DocxTable({
                                rows: [
                                    new DocxTableRow({
                                        children: [
                                            new DocxTableCell({ children: [new Paragraph({ text: "Description", bold: true })] }),
                                            new DocxTableCell({ children: [new Paragraph({ text: "Date", bold: true })] }),
                                            new DocxTableCell({ children: [new Paragraph({ text: "Amount", bold: true })] }),
                                            new DocxTableCell({ children: [new Paragraph({ text: "Type", bold: true })] }),
                                        ],
                                    }),
                                    ...transactions.map(t => new DocxTableRow({
                                        children: [
                                            new DocxTableCell({ children: [new Paragraph(t.description)] }),
                                            new DocxTableCell({ children: [new Paragraph(format(parseISO(t.date), "dd MMM, yyyy"))] }),
                                            new DocxTableCell({ children: [new Paragraph(`$${t.amount.toFixed(2)}`)] }),
                                            new DocxTableCell({ children: [new Paragraph(t.type)] }),
                                        ]
                                    }))
                                ],
                            }),
                        ],
                    }],
                });

                const blob = await Packer.toBlob(docx);
                saveAs(blob, 'transactions.docx');
                break;
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
            <Table id="transactions-table" ref={tableRef}>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
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
                             <TableCell className="text-right">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This will permanently delete this transaction. This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => handleDeleteTransaction(t.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </TableCell>
                        </TableRow>
                    ))}
                     {transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
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
