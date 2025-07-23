import { Response } from 'express';
import { storage } from '../storage';
import { insertLivraisonSchema } from '@shared/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getLivraisons = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const livraisons = await storage.getLivraisons(opticienId);
    res.json(livraisons);
  } catch (error) {
    console.error('Get livraisons error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getLivraison = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const livraison = await storage.getLivraison(parseInt(id));
    
    if (!livraison) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    // Verify ownership
    if (livraison.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(livraison);
  } catch (error) {
    console.error('Get livraison error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createLivraison = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const livraisonData = {
      ...req.body,
      opticienId
    };

    // Validate data
    const validatedData = insertLivraisonSchema.parse(livraisonData);
    
    const livraison = await storage.createLivraison(validatedData);
    res.status(201).json({
      message: 'Livraison créée avec succès',
      livraison
    });
  } catch (error) {
    console.error('Create livraison error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateLivraison = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const livraisonId = parseInt(id);
    
    // Check if livraison exists and belongs to opticien
    const existingLivraison = await storage.getLivraison(livraisonId);
    if (!existingLivraison) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }
    
    if (existingLivraison.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updatedLivraison = await storage.updateLivraison(livraisonId, req.body);
    
    if (!updatedLivraison) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    res.json({
      message: 'Livraison mise à jour avec succès',
      livraison: updatedLivraison
    });
  } catch (error) {
    console.error('Update livraison error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteLivraison = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const livraisonId = parseInt(id);
    
    // Check if livraison exists and belongs to opticien
    const existingLivraison = await storage.getLivraison(livraisonId);
    if (!existingLivraison) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }
    
    if (existingLivraison.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const success = await storage.deleteLivraison(livraisonId);
    
    if (!success) {
      return res.status(404).json({ message: 'Livraison non trouvée' });
    }

    res.json({ message: 'Livraison supprimée avec succès' });
  } catch (error) {
    console.error('Delete livraison error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
