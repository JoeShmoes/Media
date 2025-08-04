
import AppLayout from "../(app)/layout";

export default function AutoDocsPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>;
}
