import { Response } from 'express';
import { storage } from '../storage';
import { insertProduitSchema } from '@shared/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getProduits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const produits = await storage.getProduits(opticienId);
    res.json(produits);
  } catch (error) {
    console.error('Get produits error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getProduit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const produit = await storage.getProduit(parseInt(id));
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Verify ownership
    if (produit.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(produit);
  } catch (error) {
    console.error('Get produit error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createProduit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const produitData = {
      ...req.body,
      opticienId
    };

    // Validate data
    const validatedData = insertProduitSchema.parse(produitData);
    
    const produit = await storage.createProduit(validatedData);
    res.status(201).json({
      message: 'Produit créé avec succès',
      produit
    });
  } catch (error) {
    console.error('Create produit error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateProduit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const produitId = parseInt(id);
    
    // Check if produit exists and belongs to opticien
    const existingProduit = await storage.getProduit(produitId);
    if (!existingProduit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    if (existingProduit.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updatedProduit = await storage.updateProduit(produitId, req.body);
    
    if (!updatedProduit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({
      message: 'Produit mis à jour avec succès',
      produit: updatedProduit
    });
  } catch (error) {
    console.error('Update produit error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteProduit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const produitId = parseInt(id);
    
    // Check if produit exists and belongs to opticien
    const existingProduit = await storage.getProduit(produitId);
    if (!existingProduit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    if (existingProduit.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const success = await storage.deleteProduit(produitId);
    
    if (!success) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Delete produit error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
