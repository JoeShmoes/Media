
"use client"
import * as React from "react"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { OfferTemplate } from "@/lib/types";
import { OfferTemplateDialog } from "./offer-template-dialog";
import { OfferTemplateCard } from "./offer-template-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OfferTemplatePreviewDialog } from "./offer-template-preview-dialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export function OfferTemplatesView() {
  const [templates, setTemplates] = React.useState<OfferTemplate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<OfferTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = React.useState<OfferTemplate | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = React.useState<OfferTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [user] = useAuthState(auth);
  
  React.useEffect(() => {
    setIsMounted(true);
    if (!user) return;
    try {
      const savedTemplates = localStorage.getItem(`offerTemplates_${user.uid}`);
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }
    } catch (error) {
      console.error("Failed to load offer templates", error);
    }
  }, [user]);

  React.useEffect(() => {
    if (isMounted && user) {
      localStorage.setItem(`offerTemplates_${user.uid}`, JSON.stringify(templates));
    }
  }, [templates, isMounted, user]);

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setIsDialogOpen(true);
  }

  const handleEditTemplate = (template: OfferTemplate) => {
    setEditingTemplate(template);
    setIsDialogOpen(true);
  }
  
  const handlePreviewTemplate = (template: OfferTemplate) => {
    setPreviewingTemplate(template);
    setIsPreviewOpen(true);
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    setDeletingTemplate(null);
  }

  const handleSaveTemplate = (templateData: Omit<OfferTemplate, 'id'> & {id?: string}) => {
    if (templateData.id) {
      setTemplates(templates.map(t => (t.id === templateData.id ? { ...t, ...templateData } as OfferTemplate : t)));
    } else {
      const newTemplate: OfferTemplate = {
        ...templateData,
        id: `offer-template-${Date.now()}`
      };
      setTemplates([newTemplate, ...templates]);
    }
  }

  if (!isMounted) return null;

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between">
            <div className="flex-1">
                 <h2 className="text-2xl font-semibold tracking-tight">Offer Templates</h2>
                 <p className="text-muted-foreground">
                    Create and manage reusable templates for your product or service offers.
                </p>
            </div>
            <div className="flex items-center gap-2">
                 <Button onClick={handleAddTemplate}>
                    <PlusCircle className="mr-2" /> New Template
                </Button>
            </div>
       </div>
      
      <OfferTemplateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
      
      <OfferTemplatePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        template={previewingTemplate}
      />

       <AlertDialog open={!!deletingTemplate} onOpenChange={() => setDeletingTemplate(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This will permanently delete the template. This action cannot be undone.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteTemplate(deletingTemplate!.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      {templates.length === 0 ? (
         <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No templates yet</h3>
          <p className="text-muted-foreground mt-2 mb-4">Click "New Template" to create your first offer template.</p>
          <Button onClick={handleAddTemplate}>
            <PlusCircle className="mr-2"/> New Template
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          {templates.map(template => (
             <OfferTemplateCard 
                key={template.id}
                template={template}
                onView={() => handlePreviewTemplate(template)}
                onEdit={() => handleEditTemplate(template)} 
                onDelete={() => setDeletingTemplate(template)}
              />
          ))}
        </div>
      )}
    </div>
  );
}
