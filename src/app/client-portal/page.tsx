
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, MessageCircle, Upload, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Client } from "@/lib/types";

export default function ClientPortalPage() {
    const [clients, setClients] = React.useState<Client[]>([]);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        try {
            const savedClients = localStorage.getItem("clients");
            if (savedClients) {
                setClients(JSON.parse(savedClients));
            }
        } catch (error) {
            console.error("Failed to load clients from local storage", error);
        }
    }, []);

    const activeClients = clients.filter(c => c.status === 'Active');

  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Client Portal">
        <Button variant="outline"><Settings className="mr-2"/> Portal Settings</Button>
      </PageHeader>
      <p className="text-muted-foreground">
        Give clients access to their own information and project status.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {activeClients.map(client => (
             <Card key={client.id} className="glassmorphic">
                <CardHeader>
                    <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${client.name.charAt(0)}`} alt={client.name} data-ai-hint="company logo"/>
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{client.name} Portal</CardTitle>
                        <CardDescription>{client.service}</CardDescription>
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button className="w-full justify-between" disabled>View Dashboard <LinkIcon/></Button>
                    <Button asChild variant="secondary" className="w-full justify-between">
                       <a href={`mailto:${client.name.toLowerCase().replace(/\s/g, '.')}@example.com`}>Send Message <MessageCircle/></a>
                    </Button>
                </CardContent>
            </Card>
        ))}

        {activeClients.length === 0 && (
            <Card className="glassmorphic md:col-span-3 text-center">
                <CardHeader>
                    <CardTitle>No Active Clients</CardTitle>
                    <CardDescription>You currently have no active clients to display in the portal.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Change a client's status to "Active" in the Client Command Center to see their portal here.
                    </p>
                </CardContent>
            </Card>
        )}
      </div>
       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card className="glassmorphic">
          <CardHeader>
             <CardTitle>Resource Center</CardTitle>
            <CardDescription>Upload and organize client documents and videos.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" className="w-full">
                <Upload className="mr-2"/> Upload File
             </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Permissions & Views</CardTitle>
            <CardDescription>Control what each client sees and can interact with.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Permissions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
