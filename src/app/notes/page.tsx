import { PageHeader } from "@/components/page-header";
import { NotesGrid } from "./_components/notes-grid";

export default function NotesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Notes" />
      <p className="text-muted-foreground">
        Create and manage your notes. They are saved automatically.
      </p>
      <NotesGrid />
    </div>
  )
}
