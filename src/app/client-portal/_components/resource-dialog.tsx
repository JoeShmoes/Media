
"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Upload, Link } from "lucide-react"

const resourceSchema = z.object({
  name: z.string().min(1, "Resource name is required"),
  fileUrl: z.string().min(1, "File or URL is required"),
})

type FormValues = z.infer<typeof resourceSchema>

interface ResourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (resourceData: Omit<FormValues, "id">) => void
}

export function ResourceDialog({ open, onOpenChange, onSave }: ResourceDialogProps) {
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      fileUrl: "",
    },
  })
  
  React.useEffect(() => {
    form.reset()
  }, [open, form])
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const name = form.getValues("name")
    if (file && name) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        form.setValue("fileUrl", url);
      };
      reader.readAsDataURL(file);
    } else if (!name) {
        toast({
            variant: "destructive",
            title: "Name Required",
            description: "Please enter a name for the resource before selecting a file.",
        });
    }
    // Reset file input
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadClick = () => {
    if (!form.getValues("name").trim()) {
      toast({
        variant: "destructive",
        title: "Resource Name Required",
        description: "Please enter a name before uploading a file.",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const onSubmit = (data: FormValues) => {
    onSave(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Resource</DialogTitle>
          <DialogDescription>
            Upload a file or add a link to share with your clients.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Project Onboarding Guide" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File or Link URL</FormLabel>
                   <FormControl>
                    <div className="flex gap-2">
                        <Input placeholder="Or paste a URL here..." {...field} />
                         <Button type="button" variant="outline" onClick={handleUploadClick}>
                            <Upload className="mr-2 h-4 w-4" /> Upload File
                         </Button>
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                         />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Add Resource</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
