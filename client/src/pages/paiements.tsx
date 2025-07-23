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

export default function Paiements() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: paiements = [], isLoading } = useQuery({
    queryKey: ['/api/paiements'],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch('/api/paiements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch paiements');
      return response.json();
    }
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'paye':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Payé</Badge>;
      case 'en_attente':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">En attente</Badge>;
      case 'partiel':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Partiel</Badge>;
      case 'annule':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const columns = [
    {
      key: 'referenceTransaction',
      label: 'Référence',
      render: (value: string) => (
        <div className="font-mono text-sm">{value || 'N/A'}</div>
      )
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (value: string) => (
        <div className="font-medium">{parseFloat(value).toFixed(2)}€</div>
      )
    },
    {
      key: 'resteACharge',
      label: 'Reste à charge',
      render: (value: string) => {
        const amount = parseFloat(value);
        return (
          <div className={amount > 0 ? "text-red-600 font-medium" : "text-green-600"}>
            {amount.toFixed(2)}€
          </div>
        );
      }
    },
    {
      key: 'modePaiement',
      label: 'Mode de paiement',
      render: (value: string) => value || 'Non spécifié'
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'dateCreation',
      label: 'Date',
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
          title="Paiements" 
          subtitle="Paiements reçus et restes à charge" 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Paiements</h2>
                <p className="text-sm text-gray-500 mt-1">Paiements reçus et restes à charge</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau paiement
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
                data={paiements}
                columns={columns}
                emptyMessage="Aucun paiement trouvé"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
