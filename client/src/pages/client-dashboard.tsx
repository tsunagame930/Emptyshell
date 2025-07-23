import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Truck, Euro, Eye } from "lucide-react";
import { format } from "date-fns";

export function ClientDashboard() {
  const { data: clientData, isLoading } = useQuery({
    queryKey: ['/api/client/data']
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Impossible de charger vos données</p>
      </div>
    );
  }

  const { client, cagnottes, paiements, livraisons, submissions, produits } = clientData as any;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord client</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue {client.prenom} {client.nom}
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Demandes</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Demandes soumises</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cagnottes</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cagnottes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Cagnottes actives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paiements?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Paiements effectués</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livraisons</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livraisons?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Livraisons reçues</p>
          </CardContent>
        </Card>
      </div>

      {/* Mes dernières demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Demandes Récentes</CardTitle>
          <CardDescription>Vos dernières demandes soumises</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.slice(0, 3).map((submission: any) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Demande #{submission.id}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(submission.createdAt), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      submission.statut === 'en_attente' ? 'secondary' :
                      submission.statut === 'en_cours' ? 'default' :
                      submission.statut === 'termine' ? 'default' : 'destructive'
                    }
                  >
                    {submission.statut === 'en_attente' ? 'En attente' :
                     submission.statut === 'en_cours' ? 'En cours' :
                     submission.statut === 'termine' ? 'Terminé' : 'Annulé'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande soumise</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mes cagnottes */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Cagnottes</CardTitle>
          <CardDescription>Vos cagnottes d'épargne optique</CardDescription>
        </CardHeader>
        <CardContent>
          {cagnottes && cagnottes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cagnottes.map((cagnotte: any) => (
                <div key={cagnotte.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{cagnotte.nom}</h3>
                    <Badge variant="outline">{cagnotte.statut}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>Montant collecté: <span className="font-medium">{cagnotte.montantCollecte}€</span></p>
                    <p>Objectif: <span className="font-medium">{cagnotte.montantObjectif}€</span></p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((cagnotte.montantCollecte / cagnotte.montantObjectif) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Math.round((cagnotte.montantCollecte / cagnotte.montantObjectif) * 100)}% atteint
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Euro className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune cagnotte active</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Produits disponibles chez mon opticien */}
      {client.opticienId && produits && produits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produits Disponibles</CardTitle>
            <CardDescription>Produits disponibles chez votre opticien</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produits.slice(0, 6).map((produit: any) => (
                <div key={produit.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{produit.nom}</h3>
                    <Badge variant="outline">{produit.categorie}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>Marque: <span className="font-medium">{produit.marque}</span></p>
                    <p>Prix: <span className="font-medium">{produit.prix}€</span></p>
                    <p className="text-xs text-gray-500">{produit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}