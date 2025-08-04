
import AppLayout from "../(app)/layout";

export default function TemplateBuilderPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>;
}
