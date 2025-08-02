
"use client"

import * as React from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, PlusCircle, UserCog, ExternalLink, Trash2, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Client, ClientResource } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ResourceDialog } from "./_components/resource-dialog";
import { ManageAccessDialog } from "./_components/manage-access-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export default function ClientPortalPage() {
    const [clients, setClients] = React.useState<Client[]>([]);
    const [resources, setResources] = React.useState<ClientResource[]>([]);
    const [isMounted, setIsMounted] = React.useState(false);
    const [isResourceDialogOpen, setIsResourceDialogOpen] = React.useState(false);
    const [isAccessDialogOpen, setIsAccessDialogOpen] = React.useState(false);
    const { toast } = useToast();

    // Load data from localStorage
    React.useEffect(() => {
        setIsMounted(true);
        try {
            const savedClients = localStorage.getItem("clients");
            if (savedClients) {
                setClients(JSON.parse(savedClients));
            }

            const savedResources = localStorage.getItem("clientResources");
            if (savedResources) setResources(JSON.parse(savedResources));

        } catch (error) {
            console.error("Failed to load data from local storage", error);
        }
    }, []);

    // Save data to localStorage
    React.useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem("clients", JSON.stringify(clients));
                localStorage.setItem("clientResources", JSON.stringify(resources));
            } catch (error) {
                console.error("Failed to save data to local storage", error);
            }
        }
    }, [clients, resources, isMounted]);

    const handleSaveResource = (data: Omit<ClientResource, 'id' | 'clientIds'>) => {
        const newResource: ClientResource = {
            ...data,
            id: `resource-${Date.now()}`,
            clientIds: [], // Initially, no clients have access
        }
        setResources(prev => [newResource, ...prev]);
        toast({ title: "Resource added", description: `${data.name} has been added to the resource center.` });
    }
    
    const handleDeleteResource = (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id));
        toast({ title: "Resource deleted" });
    }

    const handleSaveAccess = (resourceId: string, clientIds: string[]) => {
        setResources(prev => 
            prev.map(r => r.id === resourceId ? { ...r, clientIds } : r)
        );
        toast({ title: "Access updated", description: "Client access permissions have been saved." });
    }

    if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <PageHeader title="Client Portal">
        <Button variant="outline"><Settings className="mr-2"/> Portal Settings</Button>
      </PageHeader>
      
      <ResourceDialog 
        open={isResourceDialogOpen}
        onOpenChange={setIsResourceDialogOpen}
        onSave={handleSaveResource}
      />
      <ManageAccessDialog
        open={isAccessDialogOpen}
        onOpenChange={setIsAccessDialogOpen}
        resources={resources}
        clients={clients}
        onSave={handleSaveAccess}
      />

      <Card className="glassmorphic">
        <CardHeader>
            <CardTitle>Client Portals</CardTitle>
            <CardDescription>Give clients access to their own information and project status.</CardDescription>
        </CardHeader>
        <CardContent>
            {clients.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clients.map(client => (
                        <Card key={client.id}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${client.name.charAt(0)}`} alt={client.name} data-ai-hint="company logo"/>
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{client.name}</p>
                                    <p className="text-sm text-muted-foreground">{client.service}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" disabled>
                                    View Client Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">You currently have no clients.</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Go to the Client Command Center to add your first client.</p>
                     <Button asChild>
                        <Link href="/clients"><Users className="mr-2"/>Go to Client Command Center</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
      
      <Card className="glassmorphic">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Resource Center</CardTitle>
                <CardDescription>Manage and share documents, links, and files with specific clients.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsResourceDialogOpen(true)}>
                    <PlusCircle className="mr-2"/> Add Resource
                </Button>
                <Button onClick={() => setIsAccessDialogOpen(true)}>
                    <UserCog className="mr-2"/> Manage Access
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Resource Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Shared With</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map(resource => {
                        const isLink = resource.fileUrl.startsWith('http');
                        const sharedWithCount = resource.clientIds.length;
                        return (
                             <TableRow key={resource.id}>
                                <TableCell className="font-medium">{resource.name}</TableCell>
                                <TableCell>{isLink ? "Link" : "File"}</TableCell>
                                <TableCell>{sharedWithCount} client(s)</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button asChild variant="ghost" size="icon">
                                            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" download={!isLink ? resource.name : undefined}>
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will delete the resource. Clients will no longer have access. This cannot be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteResource(resource.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                     {resources.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                No resources have been added yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
