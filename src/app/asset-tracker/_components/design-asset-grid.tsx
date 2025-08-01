
"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Palette, Type, Image as ImageIcon, Box, ExternalLink } from "lucide-react"
import type { DesignAsset } from "@/lib/types"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Image from "next/image"

const typeIcons: { [key in DesignAsset['type']]: React.ReactElement } = {
  Logo: <ImageIcon className="h-8 w-8 text-muted-foreground" />,
  Font: <Type className="h-8 w-8 text-muted-foreground" />,
  Color: <Palette className="h-8 w-8 text-muted-foreground" />,
  Mockup: <Box className="h-8 w-8 text-muted-foreground" />,
  Other: <Box className="h-8 w-8 text-muted-foreground" />,
};

interface DesignAssetGridProps {
  assets: DesignAsset[]
  onEdit: (asset: DesignAsset) => void
  onDelete: (id: string) => void
}

export function DesignAssetGrid({ assets, onEdit, onDelete }: DesignAssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>No design assets yet. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {assets.map((asset) => (
        <Card key={asset.id} className="group">
          <CardHeader>
            <CardTitle className="truncate">{asset.name}</CardTitle>
            <CardDescription>{asset.type}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            {asset.fileUrl.startsWith('http') ? (
              <Image src={asset.fileUrl} alt={asset.name} width={100} height={100} className="object-contain" />
            ) : (
              typeIcons[asset.type]
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4"/></Button>
            </a>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" onClick={() => onEdit(asset)}>
                <Edit className="h-4 w-4" />
              </Button>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the asset. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(asset.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
