import { Response } from 'express';
import { storage } from '../storage';
import { insertCagnotteSchema } from '@shared/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getCagnottes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const cagnottes = await storage.getCagnottes(opticienId);
    res.json(cagnottes);
  } catch (error) {
    console.error('Get cagnottes error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getCagnotte = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const cagnotte = await storage.getCagnotte(parseInt(id));
    
    if (!cagnotte) {
      return res.status(404).json({ message: 'Cagnotte non trouvée' });
    }

    // Verify ownership
    if (cagnotte.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(cagnotte);
  } catch (error) {
    console.error('Get cagnotte error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createCagnotte = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const cagnotteData = {
      ...req.body,
      opticienId
    };

    // Validate data
    const validatedData = insertCagnotteSchema.parse(cagnotteData);
    
    const cagnotte = await storage.createCagnotte(validatedData);
    res.status(201).json({
      message: 'Cagnotte créée avec succès',
      cagnotte
    });
  } catch (error) {
    console.error('Create cagnotte error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateCagnotte = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const cagnotteId = parseInt(id);
    
    // Check if cagnotte exists and belongs to opticien
    const existingCagnotte = await storage.getCagnotte(cagnotteId);
    if (!existingCagnotte) {
      return res.status(404).json({ message: 'Cagnotte non trouvée' });
    }
    
    if (existingCagnotte.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updatedCagnotte = await storage.updateCagnotte(cagnotteId, req.body);
    
    if (!updatedCagnotte) {
      return res.status(404).json({ message: 'Cagnotte non trouvée' });
    }

    res.json({
      message: 'Cagnotte mise à jour avec succès',
      cagnotte: updatedCagnotte
    });
  } catch (error) {
    console.error('Update cagnotte error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteCagnotte = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const cagnotteId = parseInt(id);
    
    // Check if cagnotte exists and belongs to opticien
    const existingCagnotte = await storage.getCagnotte(cagnotteId);
    if (!existingCagnotte) {
      return res.status(404).json({ message: 'Cagnotte non trouvée' });
    }
    
    if (existingCagnotte.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const success = await storage.deleteCagnotte(cagnotteId);
    
    if (!success) {
      return res.status(404).json({ message: 'Cagnotte non trouvée' });
    }

    res.json({ message: 'Cagnotte supprimée avec succès' });
  } catch (error) {
    console.error('Delete cagnotte error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
