import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated, getToken } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Cagnottes() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: cagnottes = [], isLoading } = useQuery({
    queryKey: ['/api/cagnottes'],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch('/api/cagnottes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch cagnottes');
      return response.json();
    }
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case 'terminee':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Terminée</Badge>;
      case 'annulee':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const columns = [
    {
      key: 'nom',
      label: 'Nom de la cagnotte',
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'montantObjectif',
      label: 'Objectif',
      render: (value: string) => `${parseFloat(value).toFixed(2)}€`
    },
    {
      key: 'montantCollecte',
      label: 'Collecté',
      render: (value: string, item: any) => {
        const collected = parseFloat(value);
        const target = parseFloat(item.montantObjectif);
        const percentage = (collected / target) * 100;
        
        return (
          <div>
            <div className="font-medium">{collected.toFixed(2)}€</div>
            <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
          </div>
        );
      }
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'dateCreation',
      label: 'Date de création',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, item: any) => (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="sm">
            Voir
          </Button>
          <Button variant="ghost" size="sm">
            Modifier
          </Button>
        </div>
      )
    }
  ];

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Header 
          title="Cagnottes optiques" 
          subtitle="Suivi des cagnottes créées pour vos clients" 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Cagnottes optiques</h2>
                <p className="text-sm text-gray-500 mt-1">Suivi des cagnottes créées pour vos clients</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle cagnotte
              </Button>
            </div>

            {/* Data Table */}
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  Chargement...
                </CardContent>
              </Card>
            ) : (
              <DataTable
                data={cagnottes}
                columns={columns}
                emptyMessage="Aucune cagnotte trouvée"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
