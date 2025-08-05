
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"

export default function CalendarPage() {
    const { toast } = useToast()

    const handleConnect = (service: string) => {
        toast({
            title: `Connecting to ${service}`,
            description: "This integration is coming soon!",
        })
    }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
            title="Calendar"
            description="Connect your calendars to view and manage your schedule in one place."
        >
            <Button onClick={() => handleConnect('Google Calendar')}>Connect Google Calendar</Button>
            <Button variant="secondary" onClick={() => handleConnect('Notion Calendar')}>Connect Notion Calendar</Button>
        </PageHeader>
        
        <Card className="glassmorphic">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">Your Calendar is Empty</h3>
                    <p className="text-muted-foreground mt-2 mb-4">Connect a calendar service to see your events here.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
