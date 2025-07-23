import { Request, Response } from "express";
import { storage } from "../storage";
import { insertClientSubmissionSchema } from "@shared/schema";
import { ZodError } from "zod";

interface AuthenticatedRequest extends Request {
  user?: {
    opticienId: number;
    email: string;
    userType: string;
  };
}

export const getClientSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.user?.opticienId;
    
    if (!opticienId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const submissions = await storage.getOpticienClientSubmissions(opticienId);
    res.json(submissions);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getClientSubmission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user?.opticienId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const submission = await storage.getClientSubmission(parseInt(id));
    if (!submission) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.json(submission);
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createClientSubmission = async (req: Request, res: Response) => {
  try {
    const validatedData = insertClientSubmissionSchema.parse(req.body);
    const submission = await storage.createClientSubmission(validatedData);
    res.status(201).json(submission);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: "Données invalides", 
        errors: error.errors 
      });
    }
    console.error("Erreur lors de la création de la demande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateClientSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await storage.updateClientSubmission(parseInt(id), req.body);
    
    if (!submission) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.json(submission);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la demande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteClientSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteClientSubmission(parseInt(id));
    
    if (!success) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.json({ message: "Demande supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    // Simplified file upload handler - in production would handle file storage
    const { ordonnanceFilename, mutuelleFilename } = req.body;
    
    res.json({
      message: "Fichiers uploadés avec succès",
      files: {
        ordonnanceFilename,
        mutuelleFilename
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'upload de fichiers:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};