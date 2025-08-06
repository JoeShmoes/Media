
"use client"

import * as React from "react"
import { CSVLink } from "react-csv"
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import type { Deal, DealStatus } from "@/lib/types";
import { DealCard } from "./_components/deal-card";
import { DealDialog } from "./_components/deal-dialog";
import { DealDetailsDialog } from "./_components/deal-details-dialog";
import { useToast } from "@/hooks/use-toast"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useSettings } from "@/hooks/use-settings";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, Table as DocxTable, TableCell, TableRow } from 'docx';
import { saveAs } from 'file-saver';
import { Card, CardContent } from "@/components/ui/card";

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
  const [user] = useAuthState(auth);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [isDealDialogOpen, setIsDealDialogOpen] = React.useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);
  const [editingDeal, setEditingDeal] = React.useState<Deal | null>(null);
  const [viewingDeal, setViewingDeal] = React.useState<Deal | null>(null);
  const csvLinkRef = React.useRef<any>(null);
  const { toast } = useToast();
  const { settings } = useSettings();
  const boardRef = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    setIsMounted(true);
    if (!user) return;
    try {
      const savedDeals = localStorage.getItem(`deals_${user.uid}`);
      if (savedDeals) {
        setDeals(JSON.parse(savedDeals));
      }
    } catch (error) {
      console.error("Failed to load deals from local storage", error);
    }
  }, [user]);

  React.useEffect(() => {
    if (isMounted && user) {
      try {
        localStorage.setItem(`deals_${user.uid}`, JSON.stringify(deals));
      } catch (error) {
        console.error("Failed to save deals to local storage", error);
      }
    }
  }, [deals, isMounted, user]);

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
  
  const handleExport = async () => {
    toast({
        title: "Exporting Data",
        description: `Your deals data is being downloaded as a .${settings.exportOptions} file.`,
    });
    
    if (settings.exportOptions === 'csv') {
      csvLinkRef.current?.link.click();
      return;
    }

    if (settings.exportOptions === 'png' && boardRef.current) {
        const canvas = await html2canvas(boardRef.current);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'pipeline.png';
        link.click();
        return;
    }
    
    // For PDF and DOCX, we'll create a table
    const doc = new jsPDF();
    const tableData = deals.map(d => [d.title, `$${d.value}`, d.status, d.clientName || 'N/A']);
    
    if (settings.exportOptions === 'pdf') {
        doc.text("Deals Pipeline", 14, 16);
        autoTable(doc, {
            head: [['Title', 'Value', 'Status', 'Client']],
            body: tableData,
        });
        doc.save('pipeline.pdf');
        return;
    }

    if (settings.exportOptions === 'docx') {
        const docx = new Document({
            sections: [{
                children: [
                    new Paragraph({ text: "Deals Pipeline", heading: 'Heading1' }),
                    new DocxTable({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: "Title", bold: true })] }),
                                    new TableCell({ children: [new Paragraph({ text: "Value", bold: true })] }),
                                    new TableCell({ children: [new Paragraph({ text: "Status", bold: true })] }),
                                    new TableCell({ children: [new Paragraph({ text: "Client", bold: true })] }),
                                ],
                            }),
                            ...deals.map(deal => new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(deal.title)] }),
                                    new TableCell({ children: [new Paragraph(`$${deal.value.toLocaleString()}`)] }),
                                    new TableCell({ children: [new Paragraph(deal.status)] }),
                                    new TableCell({ children: [new Paragraph(deal.clientName || 'N/A')] }),
                                ]
                            }))
                        ],
                    }),
                ],
            }],
        });

        const blob = await Packer.toBlob(docx);
        saveAs(blob, 'pipeline.docx');
        return;
    }
  }

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
      <div className="flex items-center justify-end gap-2 mb-4">
          <Button onClick={handleAddDeal}>
            <PlusCircle className="mr-2" /> Add New Deal
          </Button>
          <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2"/> Export as {settings.exportOptions.toUpperCase()}
          </Button>
          <CSVLink 
              data={deals} 
              filename={"deals.csv"}
              className="hidden"
              ref={csvLinkRef}
              target="_blank"
          />
      </div>
      
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

      <div ref={boardRef}>
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
    </div>
  );
}
