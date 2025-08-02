"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function NoteTemplatesView() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg h-full">
        <h3 className="text-xl font-semibold">Coming Soon</h3>
        <p className="text-muted-foreground mt-2 mb-4">The ability to create and manage note templates is on its way.</p>
        <Button variant="outline" asChild>
            <Link href="/template-builder">Go Back</Link>
        </Button>
    </div>
  )
}
