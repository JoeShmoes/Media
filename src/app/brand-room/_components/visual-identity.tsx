
"use client"
import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Trash2, Palette, Image as ImageIcon, Upload } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import type { BrandColor, BrandLogo } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const colorSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex code"),
})
type ColorFormValues = z.infer<typeof colorSchema>

const logoSchema = z.object({
  name: z.string().min(1, "Logo name is required"),
})
type LogoFormValues = z.infer<typeof logoSchema>

interface VisualIdentityProps {
  colors: BrandColor[]
  setColors: React.Dispatch<React.SetStateAction<BrandColor[]>>
  logos: BrandLogo[]
  setLogos: React.Dispatch<React.SetStateAction<BrandLogo[]>>
}

export function VisualIdentity({ colors, setColors, logos, setLogos }: VisualIdentityProps) {
  const { toast } = useToast()
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);
  const [logoName, setLogoName] = React.useState("");

  const colorForm = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: { name: "", hex: "" },
  })

  const handleAddColor = (data: ColorFormValues) => {
    setColors(prev => [...prev, { ...data, id: `color-${Date.now()}` }])
    colorForm.reset()
  }

  const handleDeleteColor = (id: string) => {
    setColors(prev => prev.filter(c => c.id !== id))
  }
  
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && logoName) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setLogos(prev => [...prev, { id: `logo-${Date.now()}`, name: logoName, url }]);
        setLogoName("");
      };
      reader.readAsDataURL(file);
    } else if (!logoName) {
        toast({
            variant: "destructive",
            title: "Logo Name Required",
            description: "Please enter a name for the logo before selecting a file.",
        });
    }
    // Reset file input
    if(logoFileInputRef.current) logoFileInputRef.current.value = "";
  };

  const handleUploadClick = () => {
    if (!logoName.trim()) {
      toast({
        variant: "destructive",
        title: "Logo Name Required",
        description: "Please enter a name before uploading a logo.",
      });
      return;
    }
    logoFileInputRef.current?.click();
  };


  const handleDeleteLogo = (id: string) => {
    setLogos(prev => prev.filter(l => l.id !== id))
  }

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex)
    toast({ title: "Copied to clipboard!", description: hex })
  }

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Palette /> Visual Identity</CardTitle>
        <CardDescription>Manage your brand's logos and color palette.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Palette Section */}
        <div>
          <h3 className="font-medium mb-2">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {colors.map(color => (
              <div key={color.id} className="group relative text-center">
                <div 
                    className="w-full h-20 rounded-md border" 
                    style={{ backgroundColor: color.hex, cursor: 'pointer' }}
                    onClick={() => handleCopy(color.hex)}
                />
                <p className="text-sm font-medium mt-1 truncate">{color.name}</p>
                <p className="text-xs text-muted-foreground">{color.hex}</p>
                 <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteColor(color.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
              </div>
            ))}
          </div>
          <Form {...colorForm}>
            <form onSubmit={colorForm.handleSubmit(handleAddColor)} className="flex items-start gap-2">
              <FormField control={colorForm.control} name="name" render={({ field }) => (
                <FormItem className="flex-1"><FormControl><Input placeholder="Primary Blue" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={colorForm.control} name="hex" render={({ field }) => (
                <FormItem className="flex-1"><FormControl><Input placeholder="#4285F4" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" size="icon"><PlusCircle /></Button>
            </form>
          </Form>
        </div>
        
        {/* Logos Section */}
        <div>
          <h3 className="font-medium mb-2">Logos</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {logos.map(logo => (
              <div key={logo.id} className="group relative">
                <Card className="overflow-hidden">
                   <CardContent className="p-0 aspect-square flex items-center justify-center bg-muted/50">
                        <Image src={logo.url} alt={logo.name} width={80} height={80} className="object-contain" />
                   </CardContent>
                </Card>
                <p className="text-sm font-medium mt-1 truncate text-center">{logo.name}</p>
                 <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteLogo(logo.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2">
             <Input 
                placeholder="Logo Name (e.g., Main Logo)" 
                value={logoName}
                onChange={(e) => setLogoName(e.target.value)}
              />
             <Button onClick={handleUploadClick}>
                <Upload className="mr-2 h-4 w-4" /> Upload
             </Button>
             <input
                type="file"
                ref={logoFileInputRef}
                onChange={handleLogoFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/svg+xml"
             />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
