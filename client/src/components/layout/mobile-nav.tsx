import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FileClock,
  ArrowLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function MobileNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  
  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
    {
      name: "Recebimento",
      path: "/equipment-receiving",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      name: "Status",
      path: "/cleaning-status",
      icon: <FileClock className="h-6 w-6" />,
    },
    {
      name: "Devolução",
      path: "/equipment-return",
      icon: <ArrowLeft className="h-6 w-6" />,
    },
    {
      name: "Menu",
      path: "#menu",
      icon: <Menu className="h-6 w-6" />,
      sheet: true
    },
  ];

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-primary/20 z-10">
        <div className="flex justify-around">
          {navigation.map((item) => (
            item.sheet ? (
              <Sheet key={item.path} open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center py-3 px-3 text-muted-foreground">
                    {item.icon}
                    <span className="text-xs mt-1">{item.name}</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 border-r border-primary/20">
                  <Sidebar className="relative w-full" />
                </SheetContent>
              </Sheet>
            ) : (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center py-3 px-3",
                  location === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          ))}
        </div>
      </div>
    </>
  );
}
