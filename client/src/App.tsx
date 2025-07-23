import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Demandes from "@/pages/demandes";
import Cagnottes from "@/pages/cagnottes";
import Paiements from "@/pages/paiements";
import Livraisons from "@/pages/livraisons";
import Produits from "@/pages/produits";
import Profil from "@/pages/profil";
import ClientLogin from "@/pages/client-login";
import ClientDocuments from "@/pages/client-documents";
import ClientOpticians from "@/pages/client-opticians";
import ClientConfirmation from "@/pages/client-confirmation";
import { ClientDashboard } from "@/pages/client-dashboard";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Switch>
      {/* Routes opticien */}
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/demandes" component={Demandes} />
      <Route path="/cagnottes" component={Cagnottes} />
      <Route path="/paiements" component={Paiements} />
      <Route path="/livraisons" component={Livraisons} />
      <Route path="/produits" component={Produits} />
      <Route path="/profil" component={Profil} />
      
      {/* Routes client */}
      <Route path="/client-login" component={ClientLogin} />
      <Route path="/client-dashboard" component={ClientDashboard} />
      <Route path="/client-documents" component={ClientDocuments} />
      <Route path="/client-opticians" component={ClientOpticians} />
      <Route path="/client-confirmation" component={ClientConfirmation} />
      
      {/* Route administration */}
      <Route path="/admin" component={Admin} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
