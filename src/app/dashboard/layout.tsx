import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SplashScreen } from "@/components/layout/splash-screen";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SplashScreen>
      <AppShell>
        {children}
      </AppShell>
    </SplashScreen>
  )
}
