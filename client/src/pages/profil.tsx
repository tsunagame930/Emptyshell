import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated, getToken, getCurrentOpticien } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Profil() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: opticien, isLoading } = useQuery({
    queryKey: ['/api/auth/profile'],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    }
  });

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    siret: "",
    password: ""
  });

  // Update form data when opticien data is loaded
  useEffect(() => {
    if (opticien) {
      setFormData({
        nom: opticien.nom || "",
        prenom: opticien.prenom || "",
        email: opticien.email || "",
        telephone: opticien.telephone || "",
        adresse: opticien.adresse || "",
        ville: opticien.ville || "",
        codePostal: opticien.codePostal || "",
        siret: opticien.siret || "",
        password: ""
      });
    }
  }, [opticien]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = getToken();
      const response = await apiRequest('PUT', '/api/opticien/profile', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès"
      });
      setIsEditing(false);
      // Invalidate the profile query to refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create update object, removing empty password
    const updateData = { ...formData };
    if (!updateData.password) {
      delete updateData.password;
    }
    
    updateProfileMutation.mutate(updateData);
  };

  const handleCancel = () => {
    if (opticien) {
      setFormData({
        nom: opticien.nom || "",
        prenom: opticien.prenom || "",
        email: opticien.email || "",
        telephone: opticien.telephone || "",
        adresse: opticien.adresse || "",
        ville: opticien.ville || "",
        codePostal: opticien.codePostal || "",
        siret: opticien.siret || "",
        password: ""
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Header 
          title="Mon profil" 
          subtitle="Informations et paramètres de votre compte" 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informations personnelles</CardTitle>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                      Modifier
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          name="nom"
                          type="text"
                          value={formData.nom}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          type="text"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="adresse">Adresse</Label>
                      <Input
                        id="adresse"
                        name="adresse"
                        type="text"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ville">Ville</Label>
                        <Input
                          id="ville"
                          name="ville"
                          type="text"
                          value={formData.ville}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="codePostal">Code postal</Label>
                        <Input
                          id="codePostal"
                          name="codePostal"
                          type="text"
                          value={formData.codePostal}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="siret">SIRET</Label>
                      <Input
                        id="siret"
                        name="siret"
                        type="text"
                        value={formData.siret}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    {isEditing && (
                      <>
                        <Separator />
                        <div>
                          <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Laissez vide pour conserver le mot de passe actuel"
                          />
                        </div>
                      </>
                    )}

                    {isEditing && (
                      <div className="flex space-x-4 pt-4">
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancel}
                          disabled={updateProfileMutation.isPending}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Date de création du compte</p>
                    <p className="text-sm text-gray-500">
                      {opticien?.createdAt ? new Date(opticien.createdAt).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Statut du compte</p>
                    <p className="text-sm text-green-600">Actif</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
