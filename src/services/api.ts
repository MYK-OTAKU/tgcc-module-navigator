import { Module } from '../contexts/ModuleContext';

const API_BASE_URL = 'https://mockapi.io/api/V1';

export interface CreateModuleData {
  nom: string;
  duree: number;
}

export const moduleApi = {
  async getModules(): Promise<Module[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/modules`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des modules: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  async createModule(data: CreateModuleData): Promise<Module> {
    try {
      const response = await fetch(`${API_BASE_URL}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erreur lors de la création du module: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },
};