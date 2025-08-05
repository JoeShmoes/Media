
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react"
import {
  Calendar as BigCalendar,
  momentLocalizer,
} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const sampleEvents = [
  {
    title: 'Team Standup',
    start: new Date(new Date().setHours(9, 0, 0)),
    end: new Date(new Date().setHours(9, 15, 0)),
  },
  {
    title: 'Client Call: Synergy Corp',
    start: new Date(new Date().setHours(11, 0, 0)),
    end: new Date(new Date().setHours(11, 45, 0)),
  },
  {
    title: 'Lunch Break',
    start: new Date(new Date().setHours(12, 30, 0)),
    end: new Date(new Date().setHours(13, 30, 0)),
  },
  {
    title: 'Focus Work: Project Phoenix',
    start: new Date(new Date().setHours(14, 0, 0)),
    end: new Date(new Date().setHours(16, 30, 0)),
  },
]


export default function CalendarPage() {
    const { toast } = useToast()
    const [isMounted, setIsMounted] = React.useState(false)
    const [connectedService, setConnectedService] = React.useState<"google" | "notion" | null>(null)

    React.useEffect(() => {
        setIsMounted(true)
        const savedService = localStorage.getItem("calendarConnectedService") as "google" | "notion" | null;
        if (savedService) {
            setConnectedService(savedService)
        }
    }, [])
    
    const handleConnect = (service: "google" | "notion") => {
        setConnectedService(service)
        localStorage.setItem("calendarConnectedService", service)
        toast({
            title: `Connected to ${service === 'google' ? "Google" : "Notion"} Calendar!`,
            description: "Your calendar events will now be synced.",
        })
    }
    
    const handleDisconnect = () => {
        const serviceName = connectedService === 'google' ? "Google" : "Notion";
        setConnectedService(null);
        localStorage.removeItem("calendarConnectedService");
        toast({
            title: `Disconnected from ${serviceName} Calendar`,
        });
    }

    if (!isMounted) {
        return null;
    }

    if (!connectedService) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                 <div className="grid gap-6 md:grid-cols-2">
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle>Google Calendar</CardTitle>
                            <CardDescription>Connect your Google Calendar to sync your events and meetings automatically.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => handleConnect('google')}>Connect Google Calendar</Button>
                        </CardContent>
                    </Card>
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle>Notion Calendar</CardTitle>
                            <CardDescription>Connect your Notion Calendar to bring your tasks and events into one view.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => handleConnect('notion')}>Connect Notion Calendar</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card className="glassmorphic">
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500" /> Connected to {connectedService === 'google' ? "Google" : "Notion"} Calendar</CardTitle>
                    <CardDescription>Displaying a sample schedule. Future updates will show your real events.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleDisconnect}>Disconnect</Button>
            </CardHeader>
            <CardContent className="p-6 h-[600px]">
                 <BigCalendar
                    localizer={localizer}
                    events={sampleEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    views={['day', 'week', 'month']}
                    defaultView="week"
                />
            </CardContent>
        </Card>
    </div>
  )
}
