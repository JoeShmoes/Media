
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

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
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Google Calendar</CardTitle>
                    <CardDescription>Connect your Google Calendar to sync your events and meetings automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => handleConnect('Google Calendar')}>Connect Google Calendar</Button>
                </CardContent>
            </Card>
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Notion Calendar</CardTitle>
                    <CardDescription>Connect your Notion Calendar to bring your tasks and events into one view.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => handleConnect('Notion Calendar')}>Connect Notion Calendar</Button>
                </CardContent>
            </Card>
        </div>
        
        <Card className="glassmorphic mt-8">
             <CardHeader>
                <CardTitle>Your Calendar</CardTitle>
                <CardDescription>Once connected, your events will appear here.</CardDescription>
            </CardHeader>
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
