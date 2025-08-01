
"use client"

import * as React from "react"
import { MoreHorizontal, PlusCircle } from "lucide-react"

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
import type { Client } from "@/lib/types"
import { ClientDialog } from "./_components/client-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const initialClients: Client[] = [
  {
    id: "1",
    name: "Innovate Inc.",
    service: "SEO",
    status: "Active",
    lastContact: "2024-07-28",
  },
  {
    id: "2",
    name: "QuantumLeap",
    service: "Website",
    status: "Prospect",
    lastContact: "2024-07-30",
  },
  {
    id: "3",
    name: "Synergy Corp",
    service: "Ads",
    status: "Active",
    lastContact: "2024-07-29",
  },
  {
    id: "4",
    name: "Apex Solutions",
    service: "SEO",
    status: "Completed",
    lastContact: "2024-06-15",
  },
  {
    id: "5",
    name: "NextGen Trials",
    service: "Trial",
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
  const [clients, setClients] = React.useState<Client[]>(initialClients)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingClient, setEditingClient] = React.useState<Client | null>(null)

  const handleAddClient = () => {
    setEditingClient(null)
    setIsDialogOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId))
  }

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'lastContact'> & {id?: string}) => {
    if (clientData.id) {
        // Editing existing client
        setClients(clients.map(c => (c.id === clientData.id ? { ...c, ...clientData, lastContact: new Date().toISOString().split('T')[0] } : c)))
    } else {
        // Adding new client
        const newClient: Client = {
            ...clientData,
            id: `client-${Date.now()}`,
            lastContact: new Date().toISOString().split('T')[0],
        }
        setClients([newClient, ...clients])
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Client Command Center">
        <Button onClick={handleAddClient}>
          <PlusCircle />
          Add Client
        </Button>
      </PageHeader>
      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={editingClient}
        onSave={handleSaveClient}
      />
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
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.service}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[client.status]}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.lastContact}</TableCell>
                   <TableCell>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                Edit
                              </DropdownMenuItem>
                               <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                          Delete
                                      </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                              This will permanently delete the client. This action cannot be undone.
                                          </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>Delete</AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
