
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DomainDialog } from "./_components/domain-dialog";
import { DomainList } from "./_components/domain-list";
import { DesignAssetDialog } from "./_components/design-asset-dialog";
import { DesignAssetGrid } from "./_components/design-asset-grid";
import { LegalDocDialog } from "./_components/legal-doc-dialog";
import { LegalDocList } from "./_components/legal-doc-list";
import type { Domain, DesignAsset, LegalDocument } from "@/lib/types";

export default function AssetTrackerPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  
  // State for domains
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [isDomainDialogOpen, setIsDomainDialogOpen] = React.useState(false);
  const [editingDomain, setEditingDomain] = React.useState<Domain | null>(null);

  // State for design assets
  const [designAssets, setDesignAssets] = React.useState<DesignAsset[]>([]);
  const [isDesignAssetDialogOpen, setIsDesignAssetDialogOpen] = React.useState(false);
  const [editingDesignAsset, setEditingDesignAsset] = React.useState<DesignAsset | null>(null);

  // State for legal docs
  const [legalDocs, setLegalDocs] = React.useState<LegalDocument[]>([]);
  const [isLegalDocDialogOpen, setIsLegalDocDialogOpen] = React.useState(false);
  const [editingLegalDoc, setEditingLegalDoc] = React.useState<LegalDocument | null>(null);

  // Load data from localStorage
  React.useEffect(() => {
    setIsMounted(true);
    try {
      const savedDomains = localStorage.getItem("domains");
      if (savedDomains) setDomains(JSON.parse(savedDomains));

      const savedDesignAssets = localStorage.getItem("designAssets");
      if (savedDesignAssets) setDesignAssets(JSON.parse(savedDesignAssets));

      const savedLegalDocs = localStorage.getItem("legalDocs");
      if (savedLegalDocs) setLegalDocs(JSON.parse(savedLegalDocs));
    } catch (error) {
      console.error("Failed to load assets from local storage", error);
    }
  }, []);

  // Save data to localStorage
  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("domains", JSON.stringify(domains));
        localStorage.setItem("designAssets", JSON.stringify(designAssets));
        localStorage.setItem("legalDocs", JSON.stringify(legalDocs));
      } catch (error) {
        console.error("Failed to save assets to local storage", error);
      }
    }
  }, [domains, designAssets, legalDocs, isMounted]);

  // Handlers for Domains
  const handleSaveDomain = (domainData: Omit<Domain, 'id'> & { id?: string }) => {
    if (domainData.id) {
      setDomains(domains.map(d => (d.id === domainData.id ? { ...d, ...domainData } : d)));
    } else {
      const newDomain = { ...domainData, id: `domain-${Date.now()}` };
      setDomains([newDomain, ...domains]);
    }
  };
  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setIsDomainDialogOpen(true);
  };
  const handleDeleteDomain = (id: string) => setDomains(domains.filter(d => d.id !== id));
  
  // Handlers for Design Assets
  const handleSaveDesignAsset = (assetData: Omit<DesignAsset, 'id'> & { id?: string }) => {
    if (assetData.id) {
      setDesignAssets(designAssets.map(a => (a.id === assetData.id ? { ...a, ...assetData } : a)));
    } else {
      const newAsset = { ...assetData, id: `design-${Date.now()}` };
      setDesignAssets([newAsset, ...designAssets]);
    }
  };
  const handleEditDesignAsset = (asset: DesignAsset) => {
    setEditingDesignAsset(asset);
    setIsDesignAssetDialogOpen(true);
  };
  const handleDeleteDesignAsset = (id: string) => setDesignAssets(designAssets.filter(a => a.id !== id));

  // Handlers for Legal Docs
  const handleSaveLegalDoc = (docData: Omit<LegalDocument, 'id'> & { id?: string }) => {
    if (docData.id) {
      setLegalDocs(legalDocs.map(d => (d.id === docData.id ? { ...d, ...docData } : d)));
    } else {
      const newDoc = { ...docData, id: `legal-${Date.now()}` };
      setLegalDocs([newDoc, ...legalDocs]);
    }
  };
   const handleEditLegalDoc = (doc: LegalDocument) => {
    setEditingLegalDoc(doc);
    setIsLegalDocDialogOpen(true);
  };
  const handleDeleteLegalDoc = (id: string) => setLegalDocs(legalDocs.filter(d => d.id !== id));


  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Asset Tracker" />
      <p className="text-muted-foreground">
        A central vault for all your digital and brand assets.
      </p>
      
      <DomainDialog open={isDomainDialogOpen} onOpenChange={setIsDomainDialogOpen} domain={editingDomain} onSave={handleSaveDomain} />
      <DesignAssetDialog open={isDesignAssetDialogOpen} onOpenChange={setIsDesignAssetDialogOpen} asset={editingDesignAsset} onSave={handleSaveDesignAsset} />
      <LegalDocDialog open={isLegalDocDialogOpen} onOpenChange={setIsLegalDocDialogOpen} doc={editingLegalDoc} onSave={handleSaveLegalDoc} />

      <div className="space-y-8">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> AI-Powered Search</CardTitle>
            <CardDescription>Ask questions like: "Where’s my latest pitch deck?" or "Find all logos for Project X."</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Search your assets..." />
          </CardContent>
        </Card>

        <Card className="glassmorphic">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Domains & Tools</CardTitle>
              <CardDescription>Log and manage licenses and expiration dates.</CardDescription>
            </div>
            <Button onClick={() => { setEditingDomain(null); setIsDomainDialogOpen(true); }}>
              <PlusCircle className="mr-2"/> Add Domain
            </Button>
          </CardHeader>
          <CardContent>
            <DomainList domains={domains} onEdit={handleEditDomain} onDelete={handleDeleteDomain} />
          </CardContent>
        </Card>

        <Card className="glassmorphic">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Design Library</CardTitle>
              <CardDescription>Store logos, fonts, colors, and mockups.</CardDescription>
            </div>
            <Button onClick={() => { setEditingDesignAsset(null); setIsDesignAssetDialogOpen(true); }}>
                <PlusCircle className="mr-2"/> Add Asset
            </Button>
          </CardHeader>
          <CardContent>
            <DesignAssetGrid assets={designAssets} onEdit={handleEditDesignAsset} onDelete={handleDeleteDesignAsset} />
          </CardContent>
        </Card>

        <Card className="glassmorphic">
          <CardHeader className="flex items-center justify-between">
             <div>
                <CardTitle>Legal Docs</CardTitle>
                <CardDescription>A secure place for contracts, NDAs, and templates.</CardDescription>
            </div>
            <Button onClick={() => { setEditingLegalDoc(null); setIsLegalDocDialogOpen(true); }}>
                <PlusCircle className="mr-2"/> Add Document
            </Button>
          </CardHeader>
          <CardContent>
            <LegalDocList docs={legalDocs} onEdit={handleEditLegalDoc} onDelete={handleDeleteLegalDoc} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
