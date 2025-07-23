import { apiRequest } from "./queryClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  siret?: string;
}

export interface Opticien {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  siret?: string;
  createdAt: string;
}

export const login = async (credentials: LoginCredentials) => {
  const response = await apiRequest('POST', '/api/auth/login', credentials);
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('opticien', JSON.stringify(data.opticien));
  }
  
  return data;
};

export const register = async (userData: RegisterData) => {
  const response = await apiRequest('POST', '/api/auth/register', userData);
  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('opticien', JSON.stringify(data.opticien));
  }
  
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('opticien');
  window.location.href = '/login';
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentOpticien = (): Opticien | null => {
  const opticienStr = localStorage.getItem('opticien');
  return opticienStr ? JSON.parse(opticienStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
