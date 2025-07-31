import * as React from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"

const clients = [
  {
    name: "Innovate Inc.",
    service: "SEO",
    status: "Active",
    lastContact: "2024-07-28",
  },
  {
    name: "QuantumLeap",
    service: "Website",
    status: "Prospect",
    lastContact: "2024-07-30",
  },
  {
    name: "Synergy Corp",
    service: "Ads",
    status: "Active",
    lastContact: "2024-07-29",
  },
  {
    name: "Apex Solutions",
    service: "SEO",
    status: "Completed",
    lastContact: "2024-06-15",
  },
  {
    name: "NextGen Trials",
    service: "7-Day Trial",
    status: "Active",
    lastContact: "2024-07-31",
  },
]

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" | null | undefined } = {
  Active: "default",
  Prospect: "secondary",
  Completed: "outline",
}

export default function ClientsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Client Command Center">
        <Button>
          <PlusCircle />
          Add Client
        </Button>
      </PageHeader>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.name}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.service}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[client.status]}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.lastContact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
