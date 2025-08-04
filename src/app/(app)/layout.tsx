
"use client"
import * as React from "react"
import { AppShell } from "@/components/layout/app-shell"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return null; // or a redirect component
    }
    
    return (
        <AppShell>
            {children}
        </AppShell>
    )
}
