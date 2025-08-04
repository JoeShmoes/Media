
"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";

import { auth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Header } from "../(landing)/_components/header";
import { Footer } from "../(landing)/_components/footer";

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className="text-center p-8 max-w-md w-full">
                    <Icons.logo className="w-16 h-16 mx-auto mb-4 text-white" />
                    <h1 className="text-3xl font-bold mb-2">Welcome to Nexaris Media</h1>
                    <p className="text-muted-foreground mb-8">Your central AI command hub. Sign in to continue.</p>
                    <div className="space-y-4">
                        <Button className="w-full" onClick={signInWithGoogle}>
                        <LogIn className="mr-2"/> Sign In with Google
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-8">
                        By signing in, you agree to our <Link href="/terms-of-service" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}
