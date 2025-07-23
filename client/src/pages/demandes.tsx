import { useQuery } from "@tanstack/react-query";
import { Plus, Eye, Check, X, Edit, Trash } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated, getToken } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Demandes() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['/api/demandes'],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch('/api/demandes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    }
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">En attente</Badge>;
      case 'valide':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Validé</Badge>;
      case 'refuse':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Refusé</Badge>;
      case 'incomplet':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Incomplet</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const columns = [
    {
      key: 'client',
      label: 'Client',
      render: (value: any, item: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {item.nomClient[0]}{item.prenomClient[0]}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {item.prenomClient} {item.nomClient}
            </p>
            <p className="text-xs text-gray-500">{item.emailClient}</p>
          </div>
        </div>
      )
    },
    {
      key: 'documents',
      label: 'Documents',
      render: (value: any, item: any) => (
        <div className="flex items-center space-x-2">
          {item.ordonnanceFilename && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Ordonnance
            </Badge>
          )}
          {item.mutuelleFilename ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Mutuelle
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Mutuelle manquante
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'mutuelleName',
      label: 'Mutuelle',
      render: (value: string) => value || '-'
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, item: any) => (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Check className="w-4 h-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm">
            <X className="w-4 h-4 text-red-600" />
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
          title="Demandes clients" 
          subtitle="Gestion des ordonnances et cartes mutuelles" 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Demandes clients</h2>
                <p className="text-sm text-gray-500 mt-1">Gestion des ordonnances et cartes mutuelles</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle demande
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="valide">Validé</SelectItem>
                      <SelectItem value="refuse">Refusé</SelectItem>
                      <SelectItem value="incomplet">Incomplet</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Rechercher un client..."
                    className="flex-1 min-w-64"
                  />
                  <Button variant="outline">
                    Filtrer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            {isLoading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  Chargement...
                </CardContent>
              </Card>
            ) : (
              <DataTable
                data={submissions}
                columns={columns}
                emptyMessage="Aucune demande client trouvée"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
