"use client"
import * as React from "react"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

const chartData = [
  { month: "Jan", profit: 2200 },
  { month: "Feb", profit: 2100 },
  { month: "Mar", profit: 3500 },
  { month: "Apr", profit: 4200 },
  { month: "May", profit: 5800 },
  { month: "Jun", profit: 7100 },
]

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
}

export default function FinancePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Finance" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$125,430.00</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$45,210.50</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Total Profit</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">$80,219.50</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glassmorphic">
          <CardHeader>
            <CardTitle>Profit Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3 glassmorphic">
          <CardHeader>
            <CardTitle>Monthly Goal: $10k</CardTitle>
            <CardDescription>Current month progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-foreground">$7,100 / $10,000</span>
                    <span className="text-sm font-medium text-foreground">71%</span>
                </div>
                <Progress value={71} className="w-full" />
             </div>
             <p className="text-sm text-muted-foreground">You're on track to hit your goal this month. Keep up the momentum!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
