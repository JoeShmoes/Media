
"use client"

import * as React from "react"
import { Task } from "@/lib/types"
import { addDays, differenceInDays, format, startOfWeek, endOfWeek } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface GanttChartProps {
  tasks: Task[]
}

const getWeekDays = (start: Date) => {
    const days = [];
    let currentDate = startOfWeek(start, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
        days.push(currentDate);
        currentDate = addDays(currentDate, 1);
    }
    return days;
};

export function GanttChart({ tasks }: GanttChartProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const weekDays = getWeekDays(currentDate);

    const filteredTasks = tasks.filter(t => t.startDate && t.endDate);

    const handlePrevWeek = () => {
        setCurrentDate(prev => addDays(prev, -7));
    }

    const handleNextWeek = () => {
        setCurrentDate(prev => addDays(prev, 7));
    }
    
    if (filteredTasks.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                <p className="text-lg font-semibold">No tasks with start and end dates.</p>
                <p className="mt-2">Add start and end dates to your tasks to see them in the Gantt chart.</p>
            </div>
        )
    }

    return (
        <Card className="glassmorphic">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Gantt Chart</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handlePrevWeek}><ChevronLeft/></Button>
                        <span className="font-semibold">{format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}</span>
                        <Button variant="outline" size="icon" onClick={handleNextWeek}><ChevronRight/></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div className="relative grid grid-cols-7 min-w-[800px]">
                    {/* Header */}
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className="text-center border-b p-2">
                           <p className="font-semibold text-sm">{format(day, 'EEE')}</p>
                           <p className="text-xs text-muted-foreground">{format(day, 'd')}</p>
                        </div>
                    ))}
                    
                    {/* Rows */}
                    <div className="col-span-7 grid" style={{ gridTemplateRows: `repeat(${filteredTasks.length}, minmax(40px, 1fr))` }}>
                        {filteredTasks.map((task, index) => (
                           <div key={task.id} className="col-span-7 grid grid-cols-7 border-b relative" style={{ gridRow: `${index + 1} / span 1`}}>
                               {weekDays.map(day => <div key={day.toISOString()} className="h-full border-r last:border-r-0"></div>)}
                           </div>
                        ))}
                    </div>

                    {/* Task Bars */}
                    <div className="absolute top-[53px] left-0 right-0 bottom-0 grid" style={{ gridTemplateRows: `repeat(${filteredTasks.length}, minmax(40px, 1fr))` }}>
                        {filteredTasks.map((task, index) => {
                            const startDate = new Date(task.startDate!);
                            const endDate = new Date(task.endDate!);
                            const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

                            const startOffset = Math.max(0, differenceInDays(startDate, weekStart));
                            const duration = differenceInDays(endDate, startDate) + 1;

                            if (endDate < weekStart || startDate > endOfWeek(currentDate, {weekStartsOn: 1})) {
                                return null;
                            }
                            
                            const left = `${(startOffset / 7) * 100}%`;
                            const width = `${(duration / 7) * 100}%`;
                           
                            return (
                                <div key={task.id} className="relative h-full" style={{ gridRow: `${index + 1} / span 1` }}>
                                    <div 
                                        className="absolute top-2 h-6 bg-primary rounded-md flex items-center px-2"
                                        style={{ left, width }}
                                    >
                                        <p className="text-xs font-medium text-primary-foreground truncate">{task.name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
