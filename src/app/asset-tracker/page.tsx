
"use client";

import * as React from "react";
import { useDebounce } from "use-debounce";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, PlusCircle, Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DomainDialog } from "./_components/domain-dialog";
import { DomainList } from "./_components/domain-list";
import { DesignAssetDialog } from "./_components/design-asset-dialog";
import { DesignAssetGrid } from "./_components/design-asset-grid";
import { LegalDocDialog } from "./_components/legal-doc-dialog";
import { LegalDocList } from "./_components/legal-doc-list";
import type { Domain, DesignAsset, LegalDocument, SearchAssetsOutput } from "@/lib/types";
import { searchAssets } from "@/ai/flows/search-assets";
import { useToast } from "@/hooks/use-toast";


export default function AssetTrackerPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const { toast } = useToast();
  
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

  // State for AI Search
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchAssetsOutput | null>(null);
  
  // Refs for scrolling
  const domainsRef = React.useRef<HTMLDivElement>(null);
  const designRef = React.useRef<HTMLDivElement>(null);
  const legalRef = React.useRef<HTMLDivElement>(null);


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
  
  // AI Search Effect
  React.useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      const performSearch = async () => {
        setIsSearching(true);
        setSearchResults(null);
        try {
          const results = await searchAssets({
            query: debouncedSearchQuery,
            domains,
            designAssets,
            legalDocs,
          });
          setSearchResults(results);

          // Scroll to section if results are in only one category
          const { domainIds, designAssetIds, legalDocIds } = results;
          const resultCategories = [domainIds.length > 0, designAssetIds.length > 0, legalDocIds.length > 0];
          const singleCategory = resultCategories.filter(Boolean).length === 1;
          
          if (singleCategory) {
            if (domainIds.length > 0) {
              domainsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (designAssetIds.length > 0) {
              designRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (legalDocIds.length > 0) {
              legalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }

        } catch (error) {
          console.error("AI search failed:", error);
          toast({
            variant: "destructive",
            title: "AI Search Failed",
            description: "Could not perform search. Please try again."
          });
        } finally {
          setIsSearching(false);
        }
      };
      performSearch();
    } else {
        setSearchResults(null);
    }
  }, [debouncedSearchQuery, domains, designAssets, legalDocs, toast]);


  // Handlers for Domains
  const handleSaveDomain = (domainData: Omit<Domain, 'id'> & { id?: string }) => {
    setDomains(prev => {
      if (domainData.id) {
        return prev.map(d => (d.id === domainData.id ? { ...d, ...domainData } as Domain : d));
      }
      return [{ ...domainData, id: `domain-${Date.now()}` } as Domain, ...prev];
    });
  };
  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setIsDomainDialogOpen(true);
  };
  const handleDeleteDomain = (id: string) => setDomains(domains.filter(d => d.id !== id));
  
  // Handlers for Design Assets
  const handleSaveDesignAsset = (assetData: Omit<DesignAsset, 'id'> & { id?: string }) => {
     setDesignAssets(prev => {
        if (assetData.id) {
            return prev.map(a => (a.id === assetData.id ? { ...a, ...assetData } as DesignAsset : a));
        }
        return [{ ...assetData, id: `design-${Date.now()}` } as DesignAsset, ...prev];
     });
  };
  const handleEditDesignAsset = (asset: DesignAsset) => {
    setEditingDesignAsset(asset);
    setIsDesignAssetDialogOpen(true);
  };
  const handleDeleteDesignAsset = (id: string) => setDesignAssets(designAssets.filter(a => a.id !== id));

  // Handlers for Legal Docs
  const handleSaveLegalDoc = (docData: Omit<LegalDocument, 'id'> & { id?: string }) => {
    setLegalDocs(prev => {
        if (docData.id) {
            return prev.map(d => (d.id === docData.id ? { ...d, ...docData } as LegalDocument : d));
        }
        return [{ ...docData, id: `legal-${Date.now()}` } as LegalDocument, ...prev];
    });
  };
   const handleEditLegalDoc = (doc: LegalDocument) => {
    setEditingLegalDoc(doc);
    setIsLegalDocDialogOpen(true);
  };
  const handleDeleteLegalDoc = (id: string) => setLegalDocs(legalDocs.filter(d => d.id !== id));

  const filteredDomains = searchResults ? domains.filter(d => searchResults.domainIds.includes(d.id)) : domains;
  const filteredDesignAssets = searchResults ? designAssets.filter(d => searchResults.designAssetIds.includes(d.id)) : designAssets;
  const filteredLegalDocs = searchResults ? legalDocs.filter(d => searchResults.legalDocIds.includes(d.id)) : legalDocs;


  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Asset Tracker"
        description="A central vault for all your digital and brand assets."
      />
      
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
             <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search your assets..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />}
             </div>
          </CardContent>
        </Card>

        <Card className="glassmorphic" ref={domainsRef}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Domains & Tools</CardTitle>
              <CardDescription>Log and manage licenses and expiration dates.</CardDescription>
            </div>
            <Button onClick={() => { setEditingDomain(null); setIsDomainDialogOpen(true); }}>
              <PlusCircle className="mr-2"/> Add Domain
            </Button>
          </CardHeader>
          <CardContent>
            <DomainList domains={filteredDomains} onEdit={handleEditDomain} onDelete={handleDeleteDomain} />
          </CardContent>
        </Card>

        <Card className="glassmorphic" ref={designRef}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Design Library</CardTitle>
              <CardDescription>Store logos, fonts, colors, and mockups.</CardDescription>
            </div>
            <Button onClick={() => { setEditingDesignAsset(null); setIsDesignAssetDialogOpen(true); }}>
                <PlusCircle className="mr-2"/> Add Asset
            </Button>
          </CardHeader>
          <CardContent>
            <DesignAssetGrid assets={filteredDesignAssets} onEdit={handleEditDesignAsset} onDelete={handleDeleteDesignAsset} />
          </CardContent>
        </Card>

        <Card className="glassmorphic" ref={legalRef}>
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle>Legal Docs</CardTitle>
                <CardDescription>A secure place for contracts, NDAs, and templates.</CardDescription>
            </div>
            <Button onClick={() => { setEditingLegalDoc(null); setIsLegalDocDialogOpen(true); }}>
                <PlusCircle className="mr-2"/> Add Document
            </Button>
          </CardHeader>
          <CardContent>
            <LegalDocList docs={filteredLegalDocs} onEdit={handleEditLegalDoc} onDelete={handleDeleteLegalDoc} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    