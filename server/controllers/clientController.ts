import { Response } from 'express';
import { storage } from '../storage';
import { insertClientSubmissionSchema } from '@shared/schema';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getClientSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const submissions = await storage.getClientSubmissions(opticienId);
    res.json(submissions);
  } catch (error) {
    console.error('Get client submissions error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getClientSubmission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await storage.getClientSubmission(parseInt(id));
    
    if (!submission) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    // Verify ownership
    if (submission.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get client submission error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createClientSubmission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const opticienId = req.opticien!.id;
    const submissionData = {
      ...req.body,
      opticienId
    };

    // Validate data
    const validatedData = insertClientSubmissionSchema.parse(submissionData);
    
    const submission = await storage.createClientSubmission(validatedData);
    res.status(201).json({
      message: 'Demande créée avec succès',
      submission
    });
  } catch (error) {
    console.error('Create client submission error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateClientSubmission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const submissionId = parseInt(id);
    
    // Check if submission exists and belongs to opticien
    const existingSubmission = await storage.getClientSubmission(submissionId);
    if (!existingSubmission) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    if (existingSubmission.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updatedSubmission = await storage.updateClientSubmission(submissionId, req.body);
    
    if (!updatedSubmission) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    res.json({
      message: 'Demande mise à jour avec succès',
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Update client submission error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteClientSubmission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const submissionId = parseInt(id);
    
    // Check if submission exists and belongs to opticien
    const existingSubmission = await storage.getClientSubmission(submissionId);
    if (!existingSubmission) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    if (existingSubmission.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const success = await storage.deleteClientSubmission(submissionId);
    
    if (!success) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    res.json({ message: 'Demande supprimée avec succès' });
  } catch (error) {
    console.error('Delete client submission error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const uploadFiles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Simulate file upload - in real implementation, use multer
    const { submissionId } = req.params;
    const { ordonnanceFilename, mutuelleFilename } = req.body;
    
    const submissionIdInt = parseInt(submissionId);
    
    // Check if submission exists and belongs to opticien
    const existingSubmission = await storage.getClientSubmission(submissionIdInt);
    if (!existingSubmission) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    if (existingSubmission.opticienId !== req.opticien!.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const updatedSubmission = await storage.updateClientSubmission(submissionIdInt, {
      ordonnanceFilename,
      mutuelleFilename,
      statut: ordonnanceFilename && mutuelleFilename ? 'valide' : 'incomplet'
    });

    res.json({
      message: 'Fichiers uploadés avec succès',
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Upload files error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
