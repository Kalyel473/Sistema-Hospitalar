import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import EquipmentReceiving from "@/pages/equipment-receiving";
import CleaningStatus from "@/pages/cleaning-status";
import EquipmentReturn from "@/pages/equipment-return";
import EquipmentManagement from "@/pages/equipment-management";
import Reports from "@/pages/reports";
import Dashboard from "@/pages/dashboard";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/equipment-receiving" component={EquipmentReceiving} />
      <ProtectedRoute path="/cleaning-status" component={CleaningStatus} />
      <ProtectedRoute path="/equipment-return" component={EquipmentReturn} />
      <ProtectedRoute path="/equipment-management" component={EquipmentManagement} />
      <ProtectedRoute path="/reports" component={Reports} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
