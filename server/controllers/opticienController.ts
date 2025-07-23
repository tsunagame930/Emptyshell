import { Response } from 'express';
import { storage } from '../storage';
import { insertOpticienSchema } from '@shared/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    let updateData = req.body;

    // If password is provided, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Remove undefined fields
    updateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const updatedOpticien = await storage.updateOpticien(opticienId, updateData);
    
    if (!updatedOpticien) {
      return res.status(404).json({ message: 'Opticien non trouvé' });
    }

    const { password: _, ...opticienWithoutPassword } = updatedOpticien;
    res.json({
      message: 'Profil mis à jour avec succès',
      opticien: opticienWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;

    // Get statistics for dashboard
    const [submissions, cagnottes, paiements, livraisons, produits] = await Promise.all([
      storage.getClientSubmissions(opticienId),
      storage.getCagnottes(opticienId),
      storage.getPaiements(opticienId),
      storage.getLivraisons(opticienId),
      storage.getProduits(opticienId)
    ]);

    const stats = {
      newRequests: submissions.filter(s => s.statut === 'en_attente').length,
      revenue: paiements
        .filter(p => p.statut === 'paye')
        .reduce((sum, p) => sum + parseFloat(p.montant.toString()), 0),
      deliveries: livraisons.filter(l => l.statut === 'expedie').length,
      activeSavings: cagnottes.filter(c => c.statut === 'active').length,
      totalSavingsAmount: cagnottes
        .filter(c => c.statut === 'active')
        .reduce((sum, c) => sum + parseFloat(c.montantCollecte.toString()), 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
