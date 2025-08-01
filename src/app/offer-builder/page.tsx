
"use client"
import * as React from "react"
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Offer } from "@/lib/types";
import { OfferDialog } from "./_components/offer-dialog";
import { OfferCard } from "./_components/offer-card";
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
import { OfferDetailsDialog } from "./_components/offer-details-dialog";


export default function OfferBuilderPage() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingOffer, setEditingOffer] = React.useState<Offer | null>(null);
  const [viewingOffer, setViewingOffer] = React.useState<Offer | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);

  const handleAddOffer = () => {
    setEditingOffer(null);
    setIsDialogOpen(true);
  }

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  }
  
  const handleViewOffer = (offer: Offer) => {
    setViewingOffer(offer);
    setIsDetailsDialogOpen(true);
  }

  const handleDeleteOffer = (offerId: string) => {
    setOffers(offers.filter(offer => offer.id !== offerId));
  }

  const handleSaveOffer = (offerData: Omit<Offer, 'id'> & {id?: string}) => {
    if (offerData.id) {
      setOffers(offers.map(o => (o.id === offerData.id ? { ...o, ...offerData } : o)));
    } else {
      const newOffer: Offer = {
        ...offerData,
        id: `offer-${Date.now()}`
      };
      setOffers([newOffer, ...offers]);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Offer Builder">
        <Button onClick={handleAddOffer}>
          <PlusCircle className="mr-2"/> New Offer
        </Button>
      </PageHeader>
      
      <OfferDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        offer={editingOffer}
        onSave={handleSaveOffer}
      />
      
      <OfferDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        offer={viewingOffer}
      />


      <p className="text-muted-foreground">
        Visually develop and test new products or services.
      </p>

      {offers.length === 0 ? (
         <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No offers yet</h3>
          <p className="text-muted-foreground mt-2 mb-4">Click "New Offer" to build your first offer stack.</p>
          <Button onClick={handleAddOffer}>
            <PlusCircle className="mr-2"/> New Offer
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          {offers.map(offer => (
            <AlertDialog key={offer.id}>
              <OfferCard 
                offer={offer}
                onView={() => handleViewOffer(offer)}
                onEdit={() => handleEditOffer(offer)} 
                onDelete={() => {
                  const trigger = document.getElementById(`delete-trigger-${offer.id}`);
                  trigger?.click();
                }}
              />
              <AlertDialogTrigger asChild id={`delete-trigger-${offer.id}`} className="hidden">
                  <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This will permanently delete the offer. This action cannot be undone.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteOffer(offer.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      )}
    </div>
  );
}
