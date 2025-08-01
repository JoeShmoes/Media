
"use client"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SwatchBook, MessageSquareQuote, Users, Mic } from "lucide-react";
import Link from "next/link";

export default function BrandRoomPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Brand Room" />
      <p className="text-muted-foreground">
        Codify and expand your brand's identity.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SwatchBook /> Brand Style Guide</CardTitle>
            <CardDescription>Define your logos, colors, typography, and usage rules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
                <Link href="/asset-tracker">View Style Guide</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquareQuote /> Messaging Framework</CardTitle>
            <CardDescription>Establish your taglines, elevator pitch, mission, and tone.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/notes">Define Messaging</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Persona Board</CardTitle>
            <CardDescription>Create and manage profiles for your target audiences.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="secondary" className="w-full" asChild>
                <Link href="/notes">View Personas</Link>
             </Button>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mic /> Voice Memory</CardTitle>
            <CardDescription>Train the AI to write in your unique tone for all content generation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/ai-room">Start Voice Training</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
