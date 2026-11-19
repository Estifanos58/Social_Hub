import { LeftSideBar } from "@/components/custom/sidebars/LeftSideBar";
import Modal from "@/components/shared/Modal";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <LeftSideBar />
      <main className="flex-1 flex min-w-0 overflow-hidden relative">
        {children}
      </main>
      <Modal />
    </div>
  );
}
