import * as React from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Framer } from "lucide-react"

const boardData = {
  discovery: [
    { id: "task-1", title: "Client Kickoff: Synergy Corp", service: "Website" },
    { id: "task-2", title: "Keyword Research: Innovate Inc", service: "SEO" },
  ],
  planning: [
    { id: "task-3", title: "Wireframing: Synergy Corp", service: "Website" },
    { id: "task-4", title: "Content Outline: Innovate Inc", service: "SEO", deadline: "3 days" },
  ],
  building: [
    { id: "task-5", title: "Homepage Development", service: "Website", link: "framer.com" },
    { id: "task-6", title: "On-Page Optimization", service: "SEO" },
    { id: "task-7", title: "Backend Setup", service: "Website" },
  ],
  launch: [
    { id: "task-8", title: "Final SEO Audit", service: "SEO", deadline: "Tomorrow" },
  ],
}

type BoardColumn = keyof typeof boardData

const columnTitles: Record<BoardColumn, string> = {
  discovery: "Discovery",
  planning: "Planning",
  building: "Building",
  launch: "Launch",
}

const serviceColors: { [key: string]: string } = {
  SEO: "bg-green-500",
  Website: "bg-blue-500",
}

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Website/SEO Project Board" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {(Object.keys(boardData) as BoardColumn[]).map((columnKey) => (
          <div key={columnKey} className="bg-muted/40 rounded-lg p-2">
            <h2 className="text-lg font-semibold mb-4 px-2">{columnTitles[columnKey]}</h2>
            <div className="space-y-3">
              {boardData[columnKey].map((task) => (
                <Card key={task.id} className="glassmorphic">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${serviceColors[task.service]}`} />
                      <Badge variant="outline">{task.service}</Badge>
                    </div>
                    <p className="font-medium">{task.title}</p>
                    <div className="mt-3 flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-3">
                        {task.link && <Framer className="h-4 w-4" />}
                        <FileText className="h-4 w-4" />
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-1 text-xs text-red-400">
                          <Clock className="h-3 w-3" />
                          <span>{task.deadline}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
