
"use client"
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NoteTemplatesPage() {

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between">
            <div className="flex-1">
                 <PageHeader title="Note Templates" />
                 <p className="text-muted-foreground -mt-4">
                    Create and manage reusable templates for your notes.
                </p>
            </div>
            <div className="flex items-center gap-2">
                 <Button>
                    <PlusCircle className="mr-2" /> New Template
                </Button>
            </div>
       </div>

        <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">Coming Soon</h3>
          <p className="text-muted-foreground mt-2 mb-4">The ability to create and manage note templates is on its way.</p>
           <Button variant="outline" asChild>
                <Link href="/template-builder">Go Back</Link>
            </Button>
        </div>
    </div>
  );
}
