import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { Header } from "@/components/navigation/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background-primary">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav className="lg:hidden" />
    </div>
  );
}
