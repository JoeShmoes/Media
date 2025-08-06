
"use client"

import * as React from "react"
import { MoreHorizontal, PlusCircle, Download } from "lucide-react"
import { CSVLink } from "react-csv"
import { useAuthState } from "react-firebase-hooks/auth";

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
import { useSettings } from "@/hooks/use-settings"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase";

const statusVariant: { [key: string]: "default" | "secondary" | "outline" | "destructive" | null | undefined } = {
  Active: "default",
  Prospect: "secondary",
  Completed: "outline",
}

export default function ClientsPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [clients, setClients] = React.useState<Client[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingClient, setEditingClient] = React.useState<Client | null>(null)
  const csvLinkRef = React.useRef<any>(null);
  const { settings } = useSettings();
  const { toast } = useToast();
  const [user] = useAuthState(auth);

  React.useEffect(() => {
    setIsMounted(true);
    if (!user) return;
    try {
      const savedClients = localStorage.getItem(`clients_${user.uid}`);
      if (savedClients) {
        setClients(JSON.parse(savedClients));
      }
    } catch (error) {
        console.error("Failed to load clients from local storage", error);
    }
  }, [user]);

  React.useEffect(() => {
      if (isMounted && user) {
          try {
              localStorage.setItem(`clients_${user.uid}`, JSON.stringify(clients));
          } catch(error) {
              console.error("Failed to save clients to local storage", error);
          }
      }
  }, [clients, isMounted, user]);


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
  
  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-end gap-2 mb-4">
          <Button onClick={handleAddClient}>
              <PlusCircle className="mr-2" /> Add Client
          </Button>
          <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2"/> Export as {settings.exportOptions.toUpperCase()}
          </Button>
          <CSVLink 
              data={clients} 
              filename={"clients.csv"}
              className="hidden"
              ref={csvLinkRef}
              target="_blank"
          />
      </div>
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
