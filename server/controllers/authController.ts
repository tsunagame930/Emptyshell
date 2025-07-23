import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { generateToken } from '../utils/jwt';
import { insertOpticienSchema } from '@shared/schema';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

const registerSchema = insertOpticienSchema.extend({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if opticien already exists
    const existingOpticien = await storage.getOpticienByEmail(validatedData.email);
    if (existingOpticien) {
      return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create opticien
    const opticien = await storage.createOpticien({
      ...validatedData,
      password: hashedPassword
    });

    // Generate token
    const token = generateToken({
      opticienId: opticien.id,
      email: opticien.email
    });

    // Return opticien without password
    const { password: _, ...opticienWithoutPassword } = opticien;

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      opticien: opticienWithoutPassword
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Données invalides', 
        errors: error.errors 
      });
    }
    
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find opticien
    const opticien = await storage.getOpticienByEmail(email);
    if (!opticien) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, opticien.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Generate token
    const token = generateToken({
      opticienId: opticien.id,
      email: opticien.email
    });

    // Return opticien without password
    const { password: _, ...opticienWithoutPassword } = opticien;

    res.json({
      message: 'Connexion réussie',
      token,
      opticien: opticienWithoutPassword
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Données invalides', 
        errors: error.errors 
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const opticien = await storage.getOpticien(req.opticien.id);
    if (!opticien) {
      return res.status(404).json({ message: 'Opticien non trouvé' });
    }

    const { password: _, ...opticienWithoutPassword } = opticien;
    res.json(opticienWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
