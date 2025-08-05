
import AppLayout from "../(app)/layout";

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>;
}
