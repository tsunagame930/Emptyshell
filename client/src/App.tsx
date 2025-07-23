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

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/demandes" component={Demandes} />
      <Route path="/cagnottes" component={Cagnottes} />
      <Route path="/paiements" component={Paiements} />
      <Route path="/livraisons" component={Livraisons} />
      <Route path="/produits" component={Produits} />
      <Route path="/profil" component={Profil} />
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
