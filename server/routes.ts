import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';

// Import controllers
import { register, login, getProfile } from './controllers/authController';
import { updateProfile, getStats } from './controllers/opticienController';
import { 
  getClientSubmissions, 
  getClientSubmission, 
  createClientSubmission, 
  updateClientSubmission, 
  deleteClientSubmission,
  uploadFiles 
} from './controllers/clientSubmissionController';
import {
  registerClient,
  loginClient,
  getClientProfile,
  getClientData,
  submitClientRequest
} from './controllers/clientController';
import { 
  getCagnottes, 
  getCagnotte, 
  createCagnotte, 
  updateCagnotte, 
  deleteCagnotte 
} from './controllers/cagnotteController';
import { 
  getPaiements, 
  getPaiement, 
  createPaiement, 
  updatePaiement, 
  deletePaiement 
} from './controllers/paiementController';
import { 
  getLivraisons, 
  getLivraison, 
  createLivraison, 
  updateLivraison, 
  deleteLivraison 
} from './controllers/livraisonController';
import { 
  getProduits, 
  getProduit, 
  createProduit, 
  updateProduit, 
  deleteProduit 
} from './controllers/produitController';

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS for React frontend
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || 'http://localhost:5000'
      : 'http://localhost:5000',
    credentials: true
  }));

  // Auth routes (public)
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.get('/api/auth/profile', authMiddleware, getProfile);
  
  // Client routes (public)
  app.post('/api/client/register', registerClient);
  app.post('/api/client/login', loginClient);
  
  // Client routes (protected)
  app.get('/api/client/profile', authMiddleware, getClientProfile);
  app.get('/api/client/data', authMiddleware, getClientData);
  app.post('/api/client/submit-request', authMiddleware, submitClientRequest);

  // Opticien routes (protected)
  app.put('/api/opticien/profile', authMiddleware, updateProfile);
  app.get('/api/opticien/stats', authMiddleware, getStats);

  // Client submission routes (protected)
  app.get('/api/demandes', authMiddleware, getClientSubmissions);
  app.get('/api/demandes/:id', authMiddleware, getClientSubmission);
  app.post('/api/demandes', authMiddleware, createClientSubmission);
  app.put('/api/demandes/:id', authMiddleware, updateClientSubmission);
  app.delete('/api/demandes/:id', authMiddleware, deleteClientSubmission);
  app.post('/api/demandes/:submissionId/upload', authMiddleware, uploadFiles);

  // Cagnotte routes (protected)
  app.get('/api/cagnottes', authMiddleware, getCagnottes);
  app.get('/api/cagnottes/:id', authMiddleware, getCagnotte);
  app.post('/api/cagnottes', authMiddleware, createCagnotte);
  app.put('/api/cagnottes/:id', authMiddleware, updateCagnotte);
  app.delete('/api/cagnottes/:id', authMiddleware, deleteCagnotte);

  // Paiement routes (protected)
  app.get('/api/paiements', authMiddleware, getPaiements);
  app.get('/api/paiements/:id', authMiddleware, getPaiement);
  app.post('/api/paiements', authMiddleware, createPaiement);
  app.put('/api/paiements/:id', authMiddleware, updatePaiement);
  app.delete('/api/paiements/:id', authMiddleware, deletePaiement);

  // Livraison routes (protected)
  app.get('/api/livraisons', authMiddleware, getLivraisons);
  app.get('/api/livraisons/:id', authMiddleware, getLivraison);
  app.post('/api/livraisons', authMiddleware, createLivraison);
  app.put('/api/livraisons/:id', authMiddleware, updateLivraison);
  app.delete('/api/livraisons/:id', authMiddleware, deleteLivraison);

  // Produit routes (protected)
  app.get('/api/produits', authMiddleware, getProduits);
  app.get('/api/produits/:id', authMiddleware, getProduit);
  app.post('/api/produits', authMiddleware, createProduit);
  app.put('/api/produits/:id', authMiddleware, updateProduit);
  app.delete('/api/produits/:id', authMiddleware, deleteProduit);

  const httpServer = createServer(app);
  return httpServer;
}
