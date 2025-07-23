import { 
  opticiens, 
  clientSubmissions, 
  cagnottes, 
  paiements, 
  livraisons, 
  produits,
  users,
  type Opticien,
  type InsertOpticien,
  type ClientSubmission,
  type InsertClientSubmission,
  type Cagnotte,
  type InsertCagnotte,
  type Paiement,
  type InsertPaiement,
  type Livraison,
  type InsertLivraison,
  type Produit,
  type InsertProduit,
  type User,
  type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods (for compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Opticien methods
  getOpticien(id: number): Promise<Opticien | undefined>;
  getOpticienByEmail(email: string): Promise<Opticien | undefined>;
  createOpticien(opticien: InsertOpticien): Promise<Opticien>;
  updateOpticien(id: number, opticien: Partial<InsertOpticien>): Promise<Opticien | undefined>;

  // Client Submission methods
  getClientSubmissions(opticienId: number): Promise<ClientSubmission[]>;
  getClientSubmission(id: number): Promise<ClientSubmission | undefined>;
  createClientSubmission(submission: InsertClientSubmission): Promise<ClientSubmission>;
  updateClientSubmission(id: number, submission: Partial<InsertClientSubmission>): Promise<ClientSubmission | undefined>;
  deleteClientSubmission(id: number): Promise<boolean>;

  // Cagnotte methods
  getCagnottes(opticienId: number): Promise<Cagnotte[]>;
  getCagnotte(id: number): Promise<Cagnotte | undefined>;
  createCagnotte(cagnotte: InsertCagnotte): Promise<Cagnotte>;
  updateCagnotte(id: number, cagnotte: Partial<InsertCagnotte>): Promise<Cagnotte | undefined>;
  deleteCagnotte(id: number): Promise<boolean>;

  // Paiement methods
  getPaiements(opticienId: number): Promise<Paiement[]>;
  getPaiement(id: number): Promise<Paiement | undefined>;
  createPaiement(paiement: InsertPaiement): Promise<Paiement>;
  updatePaiement(id: number, paiement: Partial<InsertPaiement>): Promise<Paiement | undefined>;
  deletePaiement(id: number): Promise<boolean>;

  // Livraison methods
  getLivraisons(opticienId: number): Promise<Livraison[]>;
  getLivraison(id: number): Promise<Livraison | undefined>;
  createLivraison(livraison: InsertLivraison): Promise<Livraison>;
  updateLivraison(id: number, livraison: Partial<InsertLivraison>): Promise<Livraison | undefined>;
  deleteLivraison(id: number): Promise<boolean>;

  // Produit methods
  getProduits(opticienId: number): Promise<Produit[]>;
  getProduit(id: number): Promise<Produit | undefined>;
  createProduit(produit: InsertProduit): Promise<Produit>;
  updateProduit(id: number, produit: Partial<InsertProduit>): Promise<Produit | undefined>;
  deleteProduit(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods (for compatibility)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Opticien methods
  async getOpticien(id: number): Promise<Opticien | undefined> {
    const [opticien] = await db.select().from(opticiens).where(eq(opticiens.id, id));
    return opticien || undefined;
  }

  async getOpticienByEmail(email: string): Promise<Opticien | undefined> {
    const [opticien] = await db.select().from(opticiens).where(eq(opticiens.email, email));
    return opticien || undefined;
  }

  async createOpticien(insertOpticien: InsertOpticien): Promise<Opticien> {
    const [opticien] = await db
      .insert(opticiens)
      .values(insertOpticien)
      .returning();
    return opticien;
  }

  async updateOpticien(id: number, updateData: Partial<InsertOpticien>): Promise<Opticien | undefined> {
    const [opticien] = await db
      .update(opticiens)
      .set(updateData)
      .where(eq(opticiens.id, id))
      .returning();
    return opticien || undefined;
  }

  // Client Submission methods
  async getClientSubmissions(opticienId: number): Promise<ClientSubmission[]> {
    return await db
      .select()
      .from(clientSubmissions)
      .where(eq(clientSubmissions.opticienId, opticienId))
      .orderBy(desc(clientSubmissions.createdAt));
  }

  async getClientSubmission(id: number): Promise<ClientSubmission | undefined> {
    const [submission] = await db.select().from(clientSubmissions).where(eq(clientSubmissions.id, id));
    return submission || undefined;
  }

  async createClientSubmission(insertSubmission: InsertClientSubmission): Promise<ClientSubmission> {
    const [submission] = await db
      .insert(clientSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async updateClientSubmission(id: number, updateData: Partial<InsertClientSubmission>): Promise<ClientSubmission | undefined> {
    const [submission] = await db
      .update(clientSubmissions)
      .set(updateData)
      .where(eq(clientSubmissions.id, id))
      .returning();
    return submission || undefined;
  }

  async deleteClientSubmission(id: number): Promise<boolean> {
    const result = await db.delete(clientSubmissions).where(eq(clientSubmissions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Cagnotte methods
  async getCagnottes(opticienId: number): Promise<Cagnotte[]> {
    return await db
      .select()
      .from(cagnottes)
      .where(eq(cagnottes.opticienId, opticienId))
      .orderBy(desc(cagnottes.dateCreation));
  }

  async getCagnotte(id: number): Promise<Cagnotte | undefined> {
    const [cagnotte] = await db.select().from(cagnottes).where(eq(cagnottes.id, id));
    return cagnotte || undefined;
  }

  async createCagnotte(insertCagnotte: InsertCagnotte): Promise<Cagnotte> {
    const [cagnotte] = await db
      .insert(cagnottes)
      .values(insertCagnotte)
      .returning();
    return cagnotte;
  }

  async updateCagnotte(id: number, updateData: Partial<InsertCagnotte>): Promise<Cagnotte | undefined> {
    const [cagnotte] = await db
      .update(cagnottes)
      .set(updateData)
      .where(eq(cagnottes.id, id))
      .returning();
    return cagnotte || undefined;
  }

  async deleteCagnotte(id: number): Promise<boolean> {
    const result = await db.delete(cagnottes).where(eq(cagnottes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Paiement methods
  async getPaiements(opticienId: number): Promise<Paiement[]> {
    return await db
      .select()
      .from(paiements)
      .where(eq(paiements.opticienId, opticienId))
      .orderBy(desc(paiements.dateCreation));
  }

  async getPaiement(id: number): Promise<Paiement | undefined> {
    const [paiement] = await db.select().from(paiements).where(eq(paiements.id, id));
    return paiement || undefined;
  }

  async createPaiement(insertPaiement: InsertPaiement): Promise<Paiement> {
    const [paiement] = await db
      .insert(paiements)
      .values(insertPaiement)
      .returning();
    return paiement;
  }

  async updatePaiement(id: number, updateData: Partial<InsertPaiement>): Promise<Paiement | undefined> {
    const [paiement] = await db
      .update(paiements)
      .set(updateData)
      .where(eq(paiements.id, id))
      .returning();
    return paiement || undefined;
  }

  async deletePaiement(id: number): Promise<boolean> {
    const result = await db.delete(paiements).where(eq(paiements.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Livraison methods
  async getLivraisons(opticienId: number): Promise<Livraison[]> {
    return await db
      .select()
      .from(livraisons)
      .where(eq(livraisons.opticienId, opticienId))
      .orderBy(desc(livraisons.dateCreation));
  }

  async getLivraison(id: number): Promise<Livraison | undefined> {
    const [livraison] = await db.select().from(livraisons).where(eq(livraisons.id, id));
    return livraison || undefined;
  }

  async createLivraison(insertLivraison: InsertLivraison): Promise<Livraison> {
    const [livraison] = await db
      .insert(livraisons)
      .values(insertLivraison)
      .returning();
    return livraison;
  }

  async updateLivraison(id: number, updateData: Partial<InsertLivraison>): Promise<Livraison | undefined> {
    const [livraison] = await db
      .update(livraisons)
      .set(updateData)
      .where(eq(livraisons.id, id))
      .returning();
    return livraison || undefined;
  }

  async deleteLivraison(id: number): Promise<boolean> {
    const result = await db.delete(livraisons).where(eq(livraisons.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Produit methods
  async getProduits(opticienId: number): Promise<Produit[]> {
    return await db
      .select()
      .from(produits)
      .where(eq(produits.opticienId, opticienId))
      .orderBy(desc(produits.createdAt));
  }

  async getProduit(id: number): Promise<Produit | undefined> {
    const [produit] = await db.select().from(produits).where(eq(produits.id, id));
    return produit || undefined;
  }

  async createProduit(insertProduit: InsertProduit): Promise<Produit> {
    const [produit] = await db
      .insert(produits)
      .values(insertProduit)
      .returning();
    return produit;
  }

  async updateProduit(id: number, updateData: Partial<InsertProduit>): Promise<Produit | undefined> {
    const [produit] = await db
      .update(produits)
      .set(updateData)
      .where(eq(produits.id, id))
      .returning();
    return produit || undefined;
  }

  async deleteProduit(id: number): Promise<boolean> {
    const result = await db.delete(produits).where(eq(produits.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
