import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Phone, Clock, Search, CheckCircle } from "lucide-react";
import { opticiansData, OpticianData } from "@/lib/data/opticiansData";
import { useToast } from "@/hooks/use-toast";

export default function ClientOpticians() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptician, setSelectedOptician] = useState<OpticianData | null>(null);

  const filteredOpticians = opticiansData.filter(optician =>
    optician.nomMagasin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    optician.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
    optician.specialites.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectOptician = (optician: OpticianData) => {
    setSelectedOptician(optician);
    
    // Sauvegarder le choix de l'opticien
    localStorage.setItem('selectedOptician', JSON.stringify(optician));
    
    toast({
      title: "Opticien sélectionné",
      description: `Vous avez choisi ${optician.nomMagasin}. Votre demande va être envoyée.`
    });
    
    // Rediriger vers une page de confirmation ou le tableau de bord client
    setTimeout(() => {
      setLocation("/client-confirmation");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choisissez votre opticien</h1>
          <p className="text-gray-600">Sélectionnez l'opticien partenaire qui réalisera vos lunettes</p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par magasin, ville ou spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Liste des opticiens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpticians.map((optician) => (
            <Card key={optician.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{optician.nomMagasin}</CardTitle>
                    <p className="text-sm text-gray-600">{optician.prenom} {optician.nom}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{optician.note}</span>
                    <span className="ml-1 text-xs text-gray-500">({optician.nombreAvis})</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2" />
                  <div className="text-sm">
                    <p>{optician.adresse}</p>
                    <p>{optician.codePostal} {optician.ville}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">{optician.telephone}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">Ouvert jusqu'à 19h</span>
                </div>

                <p className="text-sm text-gray-600">{optician.description}</p>

                {/* Spécialités */}
                <div className="space-y-2">
                  <p className="font-medium text-sm">Spécialités :</p>
                  <div className="flex flex-wrap gap-1">
                    {optician.specialites.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Marques */}
                <div className="space-y-2">
                  <p className="font-medium text-sm">Marques disponibles :</p>
                  <div className="flex flex-wrap gap-1">
                    {optician.marques.slice(0, 3).map((marque) => (
                      <Badge key={marque} variant="outline" className="text-xs">
                        {marque}
                      </Badge>
                    ))}
                    {optician.marques.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{optician.marques.length - 3} autres
                      </Badge>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => handleSelectOptician(optician)}
                  className="w-full"
                  disabled={selectedOptician?.id === optician.id}
                >
                  {selectedOptician?.id === optician.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sélectionné
                    </>
                  ) : (
                    'Choisir cet opticien'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOpticians.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun opticien trouvé pour votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}