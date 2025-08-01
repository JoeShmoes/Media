
"use client"

import * as React from "react";
import { format, getDay, parse } from "date-fns";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { RoutineBlock, DayOfWeek } from "@/lib/types";
import { RoutineBoard } from "./_components/routine-board";
import { RoutineDialog } from "./_components/routine-dialog";

const daysOfWeek: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function RoutineClockPage() {
  const [routineBlocks, setRoutineBlocks] = React.useState<RoutineBlock[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isBoardOpen, setIsBoardOpen] = React.useState(false);

  // Load from localStorage
  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedBlocks = localStorage.getItem("routineBlocks");
      if (savedBlocks) {
        setRoutineBlocks(JSON.parse(savedBlocks));
      }
    } catch (error) {
      console.error("Failed to load routine blocks from local storage", error);
    }
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("routineBlocks", JSON.stringify(routineBlocks));
      } catch (error) {
        console.error("Failed to save routine blocks to local storage", error);
      }
    }
  }, [routineBlocks, isMounted]);

  const handleSaveBlock = (blockData: Omit<RoutineBlock, 'id'> & { id?: string }) => {
    setRoutineBlocks(prev => {
      if (blockData.id) {
        return prev.map(b => (b.id === blockData.id ? { ...b, ...blockData } as RoutineBlock : b));
      }
      return [...prev, { ...blockData, id: `block-${Date.now()}` } as RoutineBlock];
    });
  };

  const handleDeleteBlock = (id: string) => {
    setRoutineBlocks(prev => prev.filter(b => b.id !== id));
  };
  
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const todayName = daysOfWeek[getDay(currentTime)];
  const todaysBlocks = routineBlocks
    .filter(block => block.day === todayName)
    .sort((a,b) => a.startTime.localeCompare(b.startTime));

  const getCurrentBlockAndTime = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    for (const block of todaysBlocks) {
        const start = parse(block.startTime, "HH:mm", new Date());
        const end = parse(block.endTime, "HH:mm", new Date());
        const startTimeInMinutes = start.getHours() * 60 + start.getMinutes();
        const endTimeInMinutes = end.getHours() * 60 + end.getMinutes();

        if(now >= startTimeInMinutes && now < endTimeInMinutes) {
            const totalDuration = endTimeInMinutes - startTimeInMinutes;
            const elapsed = now - startTimeInMinutes;
            const progress = (elapsed / totalDuration) * 100;
            return { currentBlock: block, progress };
        }
    }
    return { currentBlock: null, progress: 0 };
  }

  const { currentBlock, progress } = getCurrentBlockAndTime();

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Routine Clock">
        <Button onClick={() => setIsBoardOpen(!isBoardOpen)}>
          {isBoardOpen ? "Show Today's View" : "Show Weekly View"}
        </Button>
      </PageHeader>
      <p className="text-muted-foreground">
        Design and track your daily rhythm. All data is saved automatically.
      </p>

      {isBoardOpen ? (
        <RoutineBoard 
            routineBlocks={routineBlocks}
            onSaveBlock={handleSaveBlock}
            onDeleteBlock={handleDeleteBlock}
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glassmorphic lg:col-span-3">
            <CardHeader>
              <CardTitle>Today's Routine: {format(currentTime, "eeee, MMMM d")}</CardTitle>
              <CardDescription>
                {currentBlock ? `Current Block: ${currentBlock.name}` : "No current block. Time for a break!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysBlocks.map(block => {
                const isCurrent = block.id === currentBlock?.id;
                const isPast = !isCurrent && parse(block.endTime, "HH:mm", new Date()) < currentTime;
                return (
                  <div key={block.id} className={`p-4 rounded-lg ${isCurrent ? "bg-primary/20" : "bg-muted/30"}`}>
                    <div className="flex justify-between items-center">
                      <p className={`font-medium ${isPast ? 'text-muted-foreground line-through' : ''}`}>{block.name}</p>
                      <p className={`text-sm ${isPast ? 'text-muted-foreground' : 'font-semibold'}`}>{block.startTime} - {block.endTime}</p>
                    </div>
                    {isCurrent && (
                        <div className="mt-2">
                           <Progress value={progress} />
                           <p className="text-xs text-right mt-1 text-muted-foreground">{Math.round(progress)}% complete</p>
                        </div>
                    )}
                  </div>
                )
              })}
               {todaysBlocks.length === 0 && (
                 <div className="text-center text-muted-foreground py-12">
                    <p>No routine blocks scheduled for today.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
