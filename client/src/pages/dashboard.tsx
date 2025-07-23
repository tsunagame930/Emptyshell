import { useQuery } from "@tanstack/react-query";
import { FileText, Euro, Truck, PiggyBank } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import CardStat from "@/components/dashboard/CardStat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthenticated, getToken } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/opticien/stats'],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch('/api/opticien/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Header 
          title="Tableau de bord" 
          subtitle="Vue d'ensemble de votre activité" 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CardStat
                title="Nouvelles demandes"
                value={isLoading ? "..." : stats?.newRequests || 0}
                icon={FileText}
                iconColor="text-blue-500"
                iconBgColor="bg-blue-50"
                trend={{
                  value: "+8%",
                  label: "vs mois dernier",
                  color: "text-green-600"
                }}
              />
              
              <CardStat
                title="CA du mois"
                value={isLoading ? "..." : `${stats?.revenue || 0}€`}
                icon={Euro}
                iconColor="text-green-500"
                iconBgColor="bg-green-50"
                trend={{
                  value: "+12%",
                  label: "vs mois dernier",
                  color: "text-green-600"
                }}
              />
              
              <CardStat
                title="En livraison"
                value={isLoading ? "..." : stats?.deliveries || 0}
                icon={Truck}
                iconColor="text-amber-500"
                iconBgColor="bg-amber-50"
                trend={{
                  value: "3 urgentes",
                  label: "",
                  color: "text-amber-600"
                }}
              />
              
              <CardStat
                title="Cagnottes actives"
                value={isLoading ? "..." : stats?.activeSavings || 0}
                icon={PiggyBank}
                iconColor="text-purple-500"
                iconBgColor="bg-purple-50"
                trend={{
                  value: `${stats?.totalSavingsAmount || 0}€`,
                  label: "collectés",
                  color: "text-purple-600"
                }}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du CA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Graphique des revenus - Intégration Chart.js à venir
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Produits populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-8">
                    Aucune donnée de vente disponible
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  Aucune activité récente
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
