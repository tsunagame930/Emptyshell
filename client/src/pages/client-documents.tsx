import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CreditCard, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientDocuments() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [files, setFiles] = useState({
    ordonnance: null as File | null,
    mutuelle: null as File | null
  });

  const handleFileChange = (type: 'ordonnance' | 'mutuelle') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.ordonnance || !files.mutuelle) {
      toast({
        title: "Documents manquants",
        description: "Veuillez uploader votre ordonnance et votre carte mutuelle",
        variant: "destructive"
      });
      return;
    }

    // Sauvegarder les informations des fichiers
    localStorage.setItem('clientDocuments', JSON.stringify({
      ordonnance: files.ordonnance.name,
      mutuelle: files.mutuelle.name,
      uploadedAt: new Date().toISOString()
    }));

    toast({
      title: "Documents uploadés",
      description: "Vos documents ont été uploadés avec succès"
    });

    setLocation("/client-opticians");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload de vos documents</h1>
          <p className="text-gray-600">Veuillez uploader votre ordonnance et votre carte mutuelle</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Documents requis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ordonnance */}
              <div>
                <Label className="flex items-center text-base font-medium mb-3">
                  <FileText className="w-4 h-4 mr-2" />
                  Ordonnance médicale *
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange('ordonnance')}
                    className="hidden"
                    id="ordonnance-upload"
                  />
                  <label htmlFor="ordonnance-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-gray-400 mb-4" />
                      {files.ordonnance ? (
                        <div>
                          <p className="text-green-600 font-medium">{files.ordonnance.name}</p>
                          <p className="text-sm text-gray-500">Cliquez pour changer</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 font-medium">Cliquez pour uploader votre ordonnance</p>
                          <p className="text-sm text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Carte Mutuelle */}
              <div>
                <Label className="flex items-center text-base font-medium mb-3">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Carte mutuelle *
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange('mutuelle')}
                    className="hidden"
                    id="mutuelle-upload"
                  />
                  <label htmlFor="mutuelle-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
                      {files.mutuelle ? (
                        <div>
                          <p className="text-green-600 font-medium">{files.mutuelle.name}</p>
                          <p className="text-sm text-gray-500">Cliquez pour changer</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 font-medium">Cliquez pour uploader votre carte mutuelle</p>
                          <p className="text-sm text-gray-500">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Information :</strong> Vos documents sont sécurisés et ne seront partagés qu'avec l'opticien que vous choisirez.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={!files.ordonnance || !files.mutuelle}
              >
                Continuer vers le choix de l'opticien
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}