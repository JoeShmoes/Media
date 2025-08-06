
"use client"
import * as React from "react"
import type { BrandVoice, BrandColor, BrandLogo, Persona } from "@/lib/types";
import { BrandVoiceForm } from "./_components/brand-voice-form";
import { VisualIdentity } from "./_components/visual-identity";
import { PersonaManager } from "./_components/persona-manager";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";


export default function BrandRoomPage() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [user] = useAuthState(auth);

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
        if (!user) return;
        try {
            const savedVoice = localStorage.getItem(`brandVoice_${user.uid}`);
            if (savedVoice) setBrandVoice(JSON.parse(savedVoice));

            const savedColors = localStorage.getItem(`brandColors_${user.uid}`);
            if (savedColors) setColors(JSON.parse(savedColors));

            const savedLogos = localStorage.getItem(`brandLogos_${user.uid}`);
            if (savedLogos) setLogos(JSON.parse(savedLogos));

            const savedPersonas = localStorage.getItem(`brandPersonas_${user.uid}`);
            if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
        } catch (error) {
            console.error("Failed to load brand data from local storage", error);
        }
    }, [user]);

    // Save data to localStorage
    React.useEffect(() => {
        if (isMounted && user) {
            try {
                localStorage.setItem(`brandVoice_${user.uid}`, JSON.stringify(brandVoice));
                localStorage.setItem(`brandColors_${user.uid}`, JSON.stringify(colors));
                localStorage.setItem(`brandLogos_${user.uid}`, JSON.stringify(logos));
                localStorage.setItem(`brandPersonas_${user.uid}`, JSON.stringify(personas));
            } catch (error) {
                console.error("Failed to save brand data to local storage", error);
            }
        }
    }, [brandVoice, colors, logos, personas, isMounted, user]);

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
