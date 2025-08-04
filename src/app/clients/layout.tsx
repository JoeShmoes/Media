
import AppLayout from "../(app)/layout";

export default function ClientsPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>;
}
