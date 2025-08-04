
import AppLayout from "../(app)/layout";

export default function GmPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>;
}
