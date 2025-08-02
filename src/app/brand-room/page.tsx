
"use client"
import * as React from "react"
import type { BrandVoice, BrandColor, BrandLogo, Persona } from "@/lib/types";
import { BrandVoiceForm } from "./_components/brand-voice-form";
import { VisualIdentity } from "./_components/visual-identity";
import { PersonaManager } from "./_components/persona-manager";


export default function BrandRoomPage() {
    const [isMounted, setIsMounted] = React.useState(false);

    // State for Brand Voice
    const [brandVoice, setBrandVoice] = React.useState<BrandVoice>({ tone: '', style: '', examples: '' });

    // State for Visual Identity
    const [colors, setColors] = React.useState<BrandColor[]>([]);
    const [logos, setLogos] = React.useState<BrandLogo[]>([]);

    // State for Personas
    const [personas, setPersonas] = React.useState<Persona[]>([]);

    // Load data from localStorage
    React.useEffect(() => {
        setIsMounted(true);
        try {
            const savedVoice = localStorage.getItem("brandVoice");
            if (savedVoice) setBrandVoice(JSON.parse(savedVoice));

            const savedColors = localStorage.getItem("brandColors");
            if (savedColors) setColors(JSON.parse(savedColors));

            const savedLogos = localStorage.getItem("brandLogos");
            if (savedLogos) setLogos(JSON.parse(savedLogos));

            const savedPersonas = localStorage.getItem("brandPersonas");
            if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
        } catch (error) {
            console.error("Failed to load brand data from local storage", error);
        }
    }, []);

    // Save data to localStorage
    React.useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem("brandVoice", JSON.stringify(brandVoice));
                localStorage.setItem("brandColors", JSON.stringify(colors));
                localStorage.setItem("brandLogos", JSON.stringify(logos));
                localStorage.setItem("brandPersonas", JSON.stringify(personas));
            } catch (error) {
                console.error("Failed to save brand data to local storage", error);
            }
        }
    }, [brandVoice, colors, logos, personas, isMounted]);

    if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1 space-y-8">
            <BrandVoiceForm value={brandVoice} onChange={setBrandVoice} />
        </div>
        <div className="lg:col-span-2 space-y-8">
            <VisualIdentity 
                colors={colors} 
                setColors={setColors}
                logos={logos}
                setLogos={setLogos}
            />
            <PersonaManager personas={personas} setPersonas={setPersonas} />
        </div>
      </div>
    </div>
  );
}
