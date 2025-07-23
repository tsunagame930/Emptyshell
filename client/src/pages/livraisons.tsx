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

export default function Livraisons() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: livraisons = [], isLoading } = useQuery({
    queryKey: ['/api/livraisons'],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch('/api/livraisons', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch livraisons');
      return response.json();
    }
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'preparation':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Préparation</Badge>;
      case 'expedie':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Expédié</Badge>;
      case 'livre':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Livré</Badge>;
      case 'retour':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Retour</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const columns = [
    {
      key: 'numeroSuivi',
      label: 'N° de suivi',
      render: (value: string) => (
        <div className="font-mono text-sm">{value || 'Non assigné'}</div>
      )
    },
    {
      key: 'adresseLivraison',
      label: 'Adresse de livraison',
      render: (value: string, item: any) => (
        <div className="text-sm">
          <div>{value}</div>
          <div className="text-gray-500">
            {item.codePostalLivraison} {item.villeLivraison}
          </div>
        </div>
      )
    },
    {
      key: 'transporteur',
      label: 'Transporteur',
      render: (value: string) => value || 'Non spécifié'
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'dateCreation',
      label: 'Date création',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      key: 'dateExpedition',
      label: 'Date expédition',
      render: (value: string) => value ? new Date(value).toLocaleDateString('fr-FR') : '-'
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
          title="Livraisons" 
          subtitle="Commandes à expédier et suivis" 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Livraisons</h2>
                <p className="text-sm text-gray-500 mt-1">Commandes à expédier et suivis</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle livraison
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
                data={livraisons}
                columns={columns}
                emptyMessage="Aucune livraison trouvée"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
