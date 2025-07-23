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

export default function Produits() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: produits = [], isLoading } = useQuery({
    queryKey: ['/api/produits'],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch('/api/produits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch produits');
      return response.json();
    }
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'monture':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Monture</Badge>;
      case 'verre_correcteur':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Verre correcteur</Badge>;
      case 'verre_solaire':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Verre solaire</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Rupture</Badge>;
    } else if (stock <= 5) {
      return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Stock faible</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">En stock</Badge>;
  };

  const columns = [
    {
      key: 'nom',
      label: 'Nom',
      render: (value: string, item: any) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.marque}</div>
        </div>
      )
    },
    {
      key: 'reference',
      label: 'Référence',
      render: (value: string) => (
        <div className="font-mono text-sm">{value || 'N/A'}</div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => getTypeBadge(value)
    },
    {
      key: 'prix',
      label: 'Prix',
      render: (value: string) => (
        <div className="font-medium">{parseFloat(value).toFixed(2)}€</div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{value}</span>
          {getStockBadge(value)}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date d\'ajout',
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
          <Button variant="ghost" size="sm">
            Supprimer
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
          title="Stock produits" 
          subtitle="Gestion de votre stock de montures et verres" 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Stock produits</h2>
                <p className="text-sm text-gray-500 mt-1">Gestion de votre stock de montures et verres</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau produit
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
                data={produits}
                columns={columns}
                emptyMessage="Aucun produit trouvé"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
