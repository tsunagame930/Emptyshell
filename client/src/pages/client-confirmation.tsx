import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, CreditCard, User, ArrowLeft } from "lucide-react";
import { OpticianData } from "@/lib/data/opticiansData";

export default function ClientConfirmation() {
  const [, setLocation] = useLocation();
  const [clientData, setClientData] = useState<any>(null);
  const [documents, setDocuments] = useState<any>(null);
  const [selectedOptician, setSelectedOptician] = useState<OpticianData | null>(null);

  useEffect(() => {
    // Récupérer les données du localStorage
    const client = localStorage.getItem('clientData');
    const docs = localStorage.getItem('clientDocuments');
    const optician = localStorage.getItem('selectedOptician');

    if (client) setClientData(JSON.parse(client));
    if (docs) setDocuments(JSON.parse(docs));
    if (optician) setSelectedOptician(JSON.parse(optician));
  }, []);

  const handleNewRequest = () => {
    // Nettoyer le localStorage et recommencer le processus
    localStorage.removeItem('clientData');
    localStorage.removeItem('clientDocuments');
    localStorage.removeItem('selectedOptician');
    setLocation('/client-login');
  };

  const handleBackToOpticians = () => {
    setLocation('/client-opticians');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* En-tête de confirmation */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demande envoyée avec succès !</h1>
          <p className="text-gray-600">Votre demande a été transmise à l'opticien sélectionné</p>
        </div>

        {/* Récapitulatif */}
        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientData && (
                <div className="space-y-2">
                  <p><strong>Nom :</strong> {clientData.prenom} {clientData.nom}</p>
                  <p><strong>Email :</strong> {clientData.email}</p>
                  <p><strong>Téléphone :</strong> {clientData.telephone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents uploadés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents uploadés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents && (
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="w-4 h-4 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">Ordonnance</p>
                      <p className="text-sm text-green-600">{documents.ordonnance}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CreditCard className="w-4 h-4 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">Carte mutuelle</p>
                      <p className="text-sm text-green-600">{documents.mutuelle}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opticien sélectionné */}
          <Card>
            <CardHeader>
              <CardTitle>Opticien sélectionné</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedOptician && (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedOptician.nomMagasin}</h3>
                    <p className="text-gray-600">{selectedOptician.prenom} {selectedOptician.nom}</p>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Adresse :</strong> {selectedOptician.adresse}</p>
                    <p><strong>Ville :</strong> {selectedOptician.codePostal} {selectedOptician.ville}</p>
                    <p><strong>Téléphone :</strong> {selectedOptician.telephone}</p>
                    <p><strong>Email :</strong> {selectedOptician.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prochaines étapes */}
          <Card>
            <CardHeader>
              <CardTitle>Prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Analyse de votre demande</p>
                    <p className="text-sm text-gray-600">L'opticien va analyser votre ordonnance et vos besoins</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Contact sous 24h</p>
                    <p className="text-sm text-gray-600">Vous serez contacté pour un rendez-vous ou des précisions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Prise de mesures</p>
                    <p className="text-sm text-gray-600">Rendez-vous en magasin pour la prise de mesures et le choix des montures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button variant="outline" onClick={handleBackToOpticians} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Changer d'opticien
          </Button>
          <Button onClick={handleNewRequest} className="flex-1">
            Nouvelle demande
          </Button>
        </div>
      </div>
    </div>
  );
}