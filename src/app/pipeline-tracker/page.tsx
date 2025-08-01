
"use client"

import * as React from "react"
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Deal, DealStatus } from "@/lib/types";
import { DealCard } from "./_components/deal-card";
import { DealDialog } from "./_components/deal-dialog";
import { DealDetailsDialog } from "./_components/deal-details-dialog";

const initialDeals: Deal[] = [];

const columnOrder: DealStatus[] = ["leads", "needs-analysis", "proposal", "negotiation", "closed-won", "closed-lost"];

const columnTitles: Record<DealStatus, string> = {
  leads: "New Leads",
  "needs-analysis": "Needs Analysis",
  proposal: "Proposal Sent",
  negotiation: "Negotiation",
  "closed-won": "Closed-Won",
  "closed-lost": "Closed-Lost",
};

export default function PipelineTrackerPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [deals, setDeals] = React.useState<Deal[]>(initialDeals);
  const [isDealDialogOpen, setIsDealDialogOpen] = React.useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);
  const [editingDeal, setEditingDeal] = React.useState<Deal | null>(null);
  const [viewingDeal, setViewingDeal] = React.useState<Deal | null>(null);

  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedDeals = localStorage.getItem("deals");
      if (savedDeals) {
        setDeals(JSON.parse(savedDeals));
      }
    } catch (error) {
      console.error("Failed to load deals from local storage", error);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("deals", JSON.stringify(deals));
      } catch (error) {
        console.error("Failed to save deals to local storage", error);
      }
    }
  }, [deals, isMounted]);

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsDealDialogOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsDealDialogOpen(true);
  };

  const handleViewDeal = (deal: Deal) => {
    setViewingDeal(deal);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(deals.filter(d => d.id !== dealId));
  };

  const handleSaveDeal = (dealData: Omit<Deal, "id"> & { id?: string }) => {
    if (dealData.id) {
      // Editing existing deal
      setDeals(deals.map(d => d.id === dealData.id ? { ...d, ...dealData } as Deal : d));
    } else {
      // Adding new deal
      const newDeal: Deal = {
        ...dealData,
        id: `deal-${Date.now()}`,
      };
      setDeals([newDeal, ...deals]);
    }
  };

  const boardData = React.useMemo(() => {
    const board: { [key in DealStatus]?: Deal[] } = {};
    for (const deal of deals) {
      if (!board[deal.status]) {
        board[deal.status] = [];
      }
      board[deal.status]?.push(deal);
    }
    return board;
  }, [deals]);

  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Sales Pipeline Tracker">
        <Button onClick={handleAddDeal}>
          <PlusCircle className="mr-2" /> Add New Deal
        </Button>
      </PageHeader>
      
      <DealDialog
        open={isDealDialogOpen}
        onOpenChange={setIsDealDialogOpen}
        deal={editingDeal}
        onSave={handleSaveDeal}
      />

      <DealDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        deal={viewingDeal}
      />

      <p className="text-muted-foreground">
        Visual status boards for your sales deals.
      </p>

      {deals.length === 0 ? (
        <div className="text-center text-muted-foreground py-24 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">Your pipeline is empty</h3>
          <p className="mt-2 mb-4">Click "Add New Deal" to get started.</p>
           <Button onClick={handleAddDeal}>
              <PlusCircle className="mr-2"/> Add New Deal
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
          {columnOrder.map((columnKey) => (
            <div key={columnKey} className="bg-muted/40 rounded-lg p-2 h-full">
              <h2 className="text-lg font-semibold mb-4 px-2">{columnTitles[columnKey]}</h2>
              <div className="space-y-3">
                {boardData[columnKey]?.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onView={() => handleViewDeal(deal)}
                    onEdit={() => handleEditDeal(deal)}
                    onDelete={() => handleDeleteDeal(deal.id)}
                  />
                ))}
                {!boardData[columnKey] && <div className="h-10"></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
