import { Request, Response } from "express";
import { storage } from "../storage";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { insertClientSchema } from "@shared/schema";
import { ZodError } from "zod";

interface AuthenticatedRequest extends Request {
  user?: {
    opticienId: number;
    email: string;
    userType: string;
  };
}

export const registerClient = async (req: Request, res: Response) => {
  try {
    const validatedData = insertClientSchema.parse(req.body);
    
    // Vérifier si l'email existe déjà
    const existingClient = await storage.getClientByEmail(validatedData.email);
    if (existingClient) {
      return res.status(400).json({ message: "Un client avec cet email existe déjà" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Créer le client
    const client = await storage.createClient({
      ...validatedData,
      password: hashedPassword
    });

    // Générer le token JWT
    const token = generateToken({ 
      opticienId: client.id, 
      email: client.email,
      userType: 'client'
    });

    // Retourner le client sans le mot de passe
    const { password, ...clientWithoutPassword } = client;
    
    res.status(201).json({
      message: "Client créé avec succès",
      client: clientWithoutPassword,
      token
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Données invalides", 
        errors: error.errors 
      });
    }
    console.error("Erreur lors de la création du client:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const loginClient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Trouver le client
    const client = await storage.getClientByEmail(email);
    if (!client) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, client.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = generateToken({ 
      opticienId: client.id, 
      email: client.email,
      userType: 'client'
    });

    // Retourner le client sans le mot de passe
    const { password: _, ...clientWithoutPassword } = client;

    res.json({
      message: "Connexion réussie",
      client: clientWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Erreur lors de la connexion du client:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getClientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.user?.opticienId; // Using same field for consistency
    
    if (!clientId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const client = await storage.getClient(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    // Retourner le client sans le mot de passe
    const { password, ...clientWithoutPassword } = client;
    res.json(clientWithoutPassword);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil client:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getClientData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.user?.opticienId;
    
    if (!clientId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Récupérer toutes les données du client
    const [client, cagnottes, paiements, livraisons, submissions] = await Promise.all([
      storage.getClient(clientId),
      storage.getClientCagnottes(clientId),
      storage.getClientPaiements(clientId),
      storage.getClientLivraisons(clientId),
      storage.getClientSubmissions(clientId)
    ]);

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    // Récupérer les produits de l'opticien associé
    let produits = [];
    if (client.opticienId) {
      produits = await storage.getProduits(client.opticienId);
    }

    const { password, ...clientWithoutPassword } = client;

    res.json({
      client: clientWithoutPassword,
      cagnottes,
      paiements,
      livraisons,
      submissions,
      produits // Produits de l'opticien choisi
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données client:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const submitClientRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.user?.opticienId;
    const { opticienId, ordonnanceFilename, mutuelleFilename } = req.body;
    
    if (!clientId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Mettre à jour le client avec l'opticien choisi
    await storage.updateClientOptician(clientId, opticienId);

    // Créer la soumission
    const submission = await storage.createClientSubmission({
      clientId,
      opticienId,
      ordonnanceFilename,
      mutuelleFilename,
      statut: "en_attente"
    });

    res.status(201).json({
      message: "Demande soumise avec succès",
      submission
    });
  } catch (error) {
    console.error("Erreur lors de la soumission de la demande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};