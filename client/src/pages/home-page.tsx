import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Dashboard from "@/pages/dashboard";
import EquipmentReceiving from "@/pages/equipment-receiving";
import CleaningStatus from "@/pages/cleaning-status";
import EquipmentReturn from "@/pages/equipment-return";
import EquipmentManagement from "@/pages/equipment-management";
import Reports from "@/pages/reports";

export default function HomePage() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Determine which content to show based on current path
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    switch (location) {
      case "/":
        return <Dashboard />;
      case "/equipment-receiving":
        return <EquipmentReceiving />;
      case "/cleaning-status":
        return <CleaningStatus />;
      case "/equipment-return":
        return <EquipmentReturn />;
      case "/equipment-management":
        return <EquipmentManagement />;
      case "/reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar className="hidden lg:flex" />
      
      {/* Main content area */}
      <main className="lg:ml-64 flex-1 min-h-screen bg-background pb-16 lg:pb-0">
        {/* Mobile top navbar */}
        <div className="lg:hidden bg-background border-b border-primary/20">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="font-sans text-lg font-bold text-foreground">HospitalSys</h1>
          </div>
        </div>
        
        {/* Dynamic content based on route */}
        {renderContent()}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
