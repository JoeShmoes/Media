
"use client"

import * as React from "react"
import { MoreHorizontal, PlusCircle, Download } from "lucide-react"
import { CSVLink } from "react-csv"
import { useAuthState } from "react-firebase-hooks/auth";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow, TextRun } from 'docx';
import { saveAs } from 'file-saver';

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
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase";
import { useSettings } from "@/hooks/use-settings";

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
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const { settings } = useSettings();
  const tableRef = React.useRef<HTMLTableElement>(null);


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
  
  const handleExport = async () => {
    toast({
        title: "Exporting Data",
        description: `Your clients data is being downloaded as a .${settings.exportOptions} file.`,
    });

    switch (settings.exportOptions) {
        case 'csv':
            csvLinkRef.current?.link.click();
            break;
        case 'pdf':
            const doc = new jsPDF();
            doc.text("Clients", 14, 16);
            autoTable(doc, { html: '#clients-table' });
            doc.save('clients.pdf');
            break;
        case 'png':
             if (tableRef.current) {
                const canvas = await html2canvas(tableRef.current);
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'clients.png';
                link.click();
            }
            break;
        case 'docx':
            const docx = new Document({
                sections: [{
                    children: [
                        new Paragraph({ text: "Clients", heading: 'Heading1' }),
                        new DocxTable({
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph({ text: "Client Name", bold: true })] }),
                                        new TableCell({ children: [new Paragraph({ text: "Service", bold: true })] }),
                                        new TableCell({ children: [new Paragraph({ text: "Status", bold: true })] }),
                                        new TableCell({ children: [new Paragraph({ text: "Last Contact", bold: true })] }),
                                    ],
                                }),
                                ...clients.map(client => new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph(client.name)] }),
                                        new TableCell({ children: [new Paragraph(client.service)] }),
                                        new TableCell({ children: [new Paragraph(client.status)] }),
                                        new TableCell({ children: [new Paragraph(client.lastContact)] }),
                                    ]
                                }))
                            ],
                        }),
                    ],
                }],
            });

            const blob = await Packer.toBlob(docx);
            saveAs(blob, 'clients.docx');
            break;
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
          <Table id="clients-table" ref={tableRef}>
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
