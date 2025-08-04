
"use client"

import * as React from "react"
import { CSVLink } from "react-csv"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Framer, MoreHorizontal, PlusCircle, ExternalLink, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project, ProjectBoard, ProjectBoardColumn } from "@/lib/types"
import { ProjectDialog } from "./_components/project-dialog"
import { ProjectDetailsDialog } from "./_components/project-details-dialog"
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

const initialBoardData: ProjectBoard = {
  discovery: [],
  planning: [],
  building: [],
  launch: [],
};

const columnTitles: Record<ProjectBoardColumn, string> = {
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
  const [boardData, setBoardData] = React.useState<ProjectBoard>(initialBoardData)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [editingProject, setEditingProject] = React.useState<Project | null>(null)
  const [viewingProject, setViewingProject] = React.useState<Project | null>(null)
  const csvLinkRef = React.useRef<any>(null);
  const { settings } = useSettings();
  const { toast } = useToast();

  const handleAddProject = () => {
    setEditingProject(null)
    setIsDialogOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }
  
  const handleViewProject = (project: Project) => {
    setViewingProject(project)
    setIsDetailsOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    setBoardData(prevBoard => {
      const newBoard = { ...prevBoard };
      for (const column in newBoard) {
        newBoard[column as ProjectBoardColumn] = newBoard[column as ProjectBoardColumn].filter(p => p.id !== projectId);
      }
      return newBoard;
    });
  }

  const handleSaveProject = (projectData: Omit<Project, 'id'> & { id?: string }) => {
    const newBoard = { ...boardData };
    
    // First, remove the project from its old status column if it exists
    if (projectData.id) {
        for (const column in newBoard) {
            newBoard[column as ProjectBoardColumn] = newBoard[column as ProjectBoardColumn].filter(p => p.id !== projectData.id);
        }
    }
    
    // Then, add the new or updated project to the correct status column
    const project: Project = {
        ...projectData,
        id: projectData.id || `project-${Date.now()}`,
    };
    newBoard[project.status].unshift(project);

    setBoardData(newBoard);
  }
  
  const allProjects = React.useMemo(() => {
    return Object.values(boardData).flat();
  }, [boardData]);
  
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-end gap-2 mb-4">
          <Button onClick={handleAddProject}>
            <PlusCircle className="mr-2" /> New Project
          </Button>
           <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2"/> Export as {settings.exportOptions.toUpperCase()}
          </Button>
          <CSVLink 
              data={allProjects} 
              filename={"projects.csv"}
              className="hidden"
              ref={csvLinkRef}
              target="_blank"
          />
      </div>
      
      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={editingProject}
        onSave={handleSaveProject}
      />
      
      {viewingProject && (
         <ProjectDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            project={viewingProject}
         />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {(Object.keys(boardData) as ProjectBoardColumn[]).map((columnKey) => (
          <div key={columnKey} className="bg-muted/40 rounded-lg p-2">
            <h2 className="text-lg font-semibold mb-4 px-2">{columnTitles[columnKey]}</h2>
            <div className="space-y-3">
              {boardData[columnKey].map((project) => (
                <Card key={project.id} className="glassmorphic group cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleViewProject(project)}>
                  <CardContent className="p-3">
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                           <span className={`w-3 h-3 rounded-full ${serviceColors[project.service] || 'bg-gray-400'}`} />
                           <Badge variant="outline">{project.service}</Badge>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}>
                                    Edit
                                </DropdownMenuItem>
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()} className="text-destructive">
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the project. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="font-medium">{project.title}</p>
                    <div className="mt-3 flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-3">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="hover:text-primary">
                                <Framer className="h-4 w-4" />
                            </a>
                        )}
                        <FileText className="h-4 w-4" />
                      </div>
                      {project.deadline && (
                        <div className="flex items-center gap-1 text-xs text-red-400">
                          <Clock className="h-3 w-3" />
                          <span>{project.deadline}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {boardData[columnKey].length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No projects in this stage.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
