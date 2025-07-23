import { Response } from 'express';
import { storage } from '../storage';
import { insertPaiementSchema } from '@shared/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getPaiements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const paiements = await storage.getPaiements(opticienId);
    res.json(paiements);
  } catch (error) {
    console.error('Get paiements error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getPaiement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const paiement = await storage.getPaiement(parseInt(id));
    
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Verify ownership
    if (paiement.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(paiement);
  } catch (error) {
    console.error('Get paiement error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createPaiement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const paiementData = {
      ...req.body,
      opticienId
    };

    // Validate data
    const validatedData = insertPaiementSchema.parse(paiementData);
    
    const paiement = await storage.createPaiement(validatedData);
    res.status(201).json({
      message: 'Paiement créé avec succès',
      paiement
    });
  } catch (error) {
    console.error('Create paiement error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updatePaiement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const paiementId = parseInt(id);
    
    // Check if paiement exists and belongs to opticien
    const existingPaiement = await storage.getPaiement(paiementId);
    if (!existingPaiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    
    if (existingPaiement.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updatedPaiement = await storage.updatePaiement(paiementId, req.body);
    
    if (!updatedPaiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    res.json({
      message: 'Paiement mis à jour avec succès',
      paiement: updatedPaiement
    });
  } catch (error) {
    console.error('Update paiement error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deletePaiement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const paiementId = parseInt(id);
    
    // Check if paiement exists and belongs to opticien
    const existingPaiement = await storage.getPaiement(paiementId);
    if (!existingPaiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    
    if (existingPaiement.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const success = await storage.deletePaiement(paiementId);
    
    if (!success) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    res.json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    console.error('Delete paiement error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
