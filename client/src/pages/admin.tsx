import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  Eye, 
  Download, 
  Search, 
  Shield,
  Calendar,
  Phone,
  Mail,
  MapPin
} from "lucide-react";


interface ClientRequest {
  id: string;
  clientData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    id: number;
  };
  documents: {
    ordonnance: string;
    mutuelle: string;
    uploadedAt: string;
  };
  selectedOptician: {
    id: number;
    nom: string;
    prenom: string;
    nomMagasin: string;
    ville: string;
    telephone: string;
    email: string;
  };
  status: 'En attente' | 'En cours' | 'Terminé' | 'Annulé';
  createdAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mot de passe administrateur (en production, ceci devrait être sécurisé côté serveur)
  const ADMIN_PASSWORD = "admin2025";

  useEffect(() => {
    if (isAuthenticated) {
      loadClientRequests();
    }
  }, [isAuthenticated]);

  const loadClientRequests = () => {
    // Simuler des données de demandes clients (en production, ceci viendrait de votre base de données)
    const mockRequests: ClientRequest[] = [
      {
        id: "REQ-001",
        clientData: {
          nom: "Dupont",
          prenom: "Marie",
          email: "marie.dupont@email.com",
          telephone: "06 12 34 56 78",
          id: 1001
        },
        documents: {
          ordonnance: "ordonnance_marie_dupont.pdf",
          mutuelle: "mutuelle_marie_dupont.jpg",
          uploadedAt: "2025-01-23T14:30:00Z"
        },
        selectedOptician: {
          id: 1,
          nom: "Martin",
          prenom: "Sophie",
          nomMagasin: "Optique Martin",
          ville: "Paris",
          telephone: "01 42 33 44 55",
          email: "sophie.martin@optique-martin.fr"
        },
        status: "En attente",
        createdAt: "2025-01-23T14:35:00Z"
      },
      {
        id: "REQ-002",
        clientData: {
          nom: "Bernard",
          prenom: "Pierre",
          email: "pierre.bernard@gmail.com",
          telephone: "06 98 76 54 32",
          id: 1002
        },
        documents: {
          ordonnance: "ordonnance_pierre_bernard.pdf",
          mutuelle: "mutuelle_pierre_bernard.png",
          uploadedAt: "2025-01-23T10:15:00Z"
        },
        selectedOptician: {
          id: 2,
          nom: "Dubois",
          prenom: "Jean-Pierre",
          nomMagasin: "Vision Plus",
          ville: "Paris",
          telephone: "01 45 67 89 12",
          email: "jp.dubois@vision-plus.fr"
        },
        status: "En cours",
        createdAt: "2025-01-23T10:20:00Z"
      },
      {
        id: "REQ-003",
        clientData: {
          nom: "Moreau",
          prenom: "Julie",
          email: "julie.moreau@yahoo.fr",
          telephone: "07 11 22 33 44",
          id: 1003
        },
        documents: {
          ordonnance: "ordonnance_julie_moreau.pdf",
          mutuelle: "mutuelle_julie_moreau.jpg",
          uploadedAt: "2025-01-22T16:45:00Z"
        },
        selectedOptician: {
          id: 5,
          nom: "Rousseau",
          prenom: "Catherine",
          nomMagasin: "Krys Rousseau",
          ville: "Lyon",
          telephone: "04 72 33 44 55",
          email: "catherine.rousseau@krys.fr"
        },
        status: "Terminé",
        createdAt: "2025-01-22T16:50:00Z"
      }
    ];
    setClientRequests(mockRequests);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const filteredRequests = clientRequests.filter(request =>
    request.clientData.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clientData.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.clientData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.selectedOptician.nomMagasin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Administration</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Accès réservé aux administrateurs
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe administrateur"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administration Emptyshell</h1>
            <p className="text-gray-600">Gestion des demandes clients et des opticiens</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
          >
            Se déconnecter
          </Button>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">Demandes clients</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {/* Barre de recherche */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou opticien..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>

            {/* Liste des demandes */}
            <div className="grid gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Demande {request.id} - {request.clientData.prenom} {request.clientData.nom}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Créée le {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Informations client */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Informations client
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            {request.clientData.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            {request.clientData.telephone}
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Documents
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Ordonnance:</span>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Voir
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Carte mutuelle:</span>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Voir
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Uploadés le {formatDate(request.documents.uploadedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Opticien sélectionné */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Opticien sélectionné
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">{request.selectedOptician.nomMagasin}</p>
                          <p>{request.selectedOptician.prenom} {request.selectedOptician.nom}</p>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            {request.selectedOptician.telephone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            {request.selectedOptician.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total demandes</p>
                      <p className="text-2xl font-bold">{clientRequests.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">En attente</p>
                      <p className="text-2xl font-bold">
                        {clientRequests.filter(r => r.status === 'En attente').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">En cours</p>
                      <p className="text-2xl font-bold">
                        {clientRequests.filter(r => r.status === 'En cours').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Terminées</p>
                      <p className="text-2xl font-bold">
                        {clientRequests.filter(r => r.status === 'Terminé').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}