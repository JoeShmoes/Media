import { AppShell } from "@/components/layout/app-shell";

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white">
            <AppShell>
                {children}
            </AppShell>
        </div>
    )
}
