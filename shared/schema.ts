import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Opticien table
export const opticiens = pgTable("opticiens", {
  id: serial("id").primaryKey(),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  telephone: text("telephone"),
  adresse: text("adresse"),
  ville: text("ville"),
  codePostal: text("code_postal"),
  siret: text("siret"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Client Submissions table
export const clientSubmissions = pgTable("client_submissions", {
  id: serial("id").primaryKey(),
  opticienId: integer("opticien_id").notNull().references(() => opticiens.id),
  nomClient: text("nom_client").notNull(),
  prenomClient: text("prenom_client").notNull(),
  emailClient: text("email_client").notNull(),
  telephoneClient: text("telephone_client"),
  ordonnanceFilename: text("ordonnance_filename"),
  mutuelleName: text("mutuelle_name"),
  mutuelleFilename: text("mutuelle_filename"),
  statut: text("statut").notNull().default("en_attente"), // en_attente, valide, refuse, incomplet
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cagnottes table
export const cagnottes = pgTable("cagnottes", {
  id: serial("id").primaryKey(),
  opticienId: integer("opticien_id").notNull().references(() => opticiens.id),
  clientSubmissionId: integer("client_submission_id").references(() => clientSubmissions.id),
  nom: text("nom").notNull(),
  montantObjectif: decimal("montant_objectif", { precision: 10, scale: 2 }).notNull(),
  montantCollecte: decimal("montant_collecte", { precision: 10, scale: 2 }).notNull().default("0.00"),
  statut: text("statut").notNull().default("active"), // active, terminee, annulee
  dateCreation: timestamp("date_creation").defaultNow().notNull(),
  dateLivraison: timestamp("date_livraison"),
});

// Paiements table
export const paiements = pgTable("paiements", {
  id: serial("id").primaryKey(),
  opticienId: integer("opticien_id").notNull().references(() => opticiens.id),
  cagnotteId: integer("cagnotte_id").references(() => cagnottes.id),
  montant: decimal("montant", { precision: 10, scale: 2 }).notNull(),
  resteACharge: decimal("reste_a_charge", { precision: 10, scale: 2 }).notNull().default("0.00"),
  statut: text("statut").notNull().default("en_attente"), // en_attente, paye, partiel, annule
  modePaiement: text("mode_paiement"), // carte, virement, cheque, especes
  referenceTransaction: text("reference_transaction"),
  dateCreation: timestamp("date_creation").defaultNow().notNull(),
  datePaiement: timestamp("date_paiement"),
});

// Livraisons table
export const livraisons = pgTable("livraisons", {
  id: serial("id").primaryKey(),
  opticienId: integer("opticien_id").notNull().references(() => opticiens.id),
  paiementId: integer("paiement_id").references(() => paiements.id),
  adresseLivraison: text("adresse_livraison").notNull(),
  villeLivraison: text("ville_livraison").notNull(),
  codePostalLivraison: text("code_postal_livraison").notNull(),
  transporteur: text("transporteur"),
  numeroSuivi: text("numero_suivi"),
  statut: text("statut").notNull().default("preparation"), // preparation, expedie, livre, retour
  dateCreation: timestamp("date_creation").defaultNow().notNull(),
  dateExpedition: timestamp("date_expedition"),
  dateLivraison: timestamp("date_livraison"),
});

// Produits table
export const produits = pgTable("produits", {
  id: serial("id").primaryKey(),
  opticienId: integer("opticien_id").notNull().references(() => opticiens.id),
  nom: text("nom").notNull(),
  marque: text("marque"),
  type: text("type").notNull(), // monture, verre_correcteur, verre_solaire
  reference: text("reference"),
  prix: decimal("prix", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  description: text("description"),
  caracteristiques: jsonb("caracteristiques"), // JSON for flexible product specs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const opticiensRelations = relations(opticiens, ({ many }) => ({
  clientSubmissions: many(clientSubmissions),
  cagnottes: many(cagnottes),
  paiements: many(paiements),
  livraisons: many(livraisons),
  produits: many(produits),
}));

export const clientSubmissionsRelations = relations(clientSubmissions, ({ one, many }) => ({
  opticien: one(opticiens, {
    fields: [clientSubmissions.opticienId],
    references: [opticiens.id],
  }),
  cagnottes: many(cagnottes),
}));

export const cagnottesRelations = relations(cagnottes, ({ one, many }) => ({
  opticien: one(opticiens, {
    fields: [cagnottes.opticienId],
    references: [opticiens.id],
  }),
  clientSubmission: one(clientSubmissions, {
    fields: [cagnottes.clientSubmissionId],
    references: [clientSubmissions.id],
  }),
  paiements: many(paiements),
}));

export const paiementsRelations = relations(paiements, ({ one, many }) => ({
  opticien: one(opticiens, {
    fields: [paiements.opticienId],
    references: [opticiens.id],
  }),
  cagnotte: one(cagnottes, {
    fields: [paiements.cagnotteId],
    references: [cagnottes.id],
  }),
  livraisons: many(livraisons),
}));

export const livraisonsRelations = relations(livraisons, ({ one }) => ({
  opticien: one(opticiens, {
    fields: [livraisons.opticienId],
    references: [opticiens.id],
  }),
  paiement: one(paiements, {
    fields: [livraisons.paiementId],
    references: [paiements.id],
  }),
}));

export const produitsRelations = relations(produits, ({ one }) => ({
  opticien: one(opticiens, {
    fields: [produits.opticienId],
    references: [opticiens.id],
  }),
}));

// Insert schemas
export const insertOpticienSchema = createInsertSchema(opticiens).omit({
  id: true,
  createdAt: true,
});

export const insertClientSubmissionSchema = createInsertSchema(clientSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertCagnotteSchema = createInsertSchema(cagnottes).omit({
  id: true,
  dateCreation: true,
});

export const insertPaiementSchema = createInsertSchema(paiements).omit({
  id: true,
  dateCreation: true,
});

export const insertLivraisonSchema = createInsertSchema(livraisons).omit({
  id: true,
  dateCreation: true,
});

export const insertProduitSchema = createInsertSchema(produits).omit({
  id: true,
  createdAt: true,
});

// Types
export type Opticien = typeof opticiens.$inferSelect;
export type InsertOpticien = z.infer<typeof insertOpticienSchema>;

export type ClientSubmission = typeof clientSubmissions.$inferSelect;
export type InsertClientSubmission = z.infer<typeof insertClientSubmissionSchema>;

export type Cagnotte = typeof cagnottes.$inferSelect;
export type InsertCagnotte = z.infer<typeof insertCagnotteSchema>;

export type Paiement = typeof paiements.$inferSelect;
export type InsertPaiement = z.infer<typeof insertPaiementSchema>;

export type Livraison = typeof livraisons.$inferSelect;
export type InsertLivraison = z.infer<typeof insertLivraisonSchema>;

export type Produit = typeof produits.$inferSelect;
export type InsertProduit = z.infer<typeof insertProduitSchema>;

// Legacy user table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
