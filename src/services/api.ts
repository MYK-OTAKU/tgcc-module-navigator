import { Module } from '../contexts/ModuleContext';

const API_BASE_URL = 'https://68719baa76a5723aacd25f94.mockapi.io/api/tgcc';

export interface CreateModuleData {
  nom: string;
  duree: number;
}

export interface UpdateModuleData {
  nom?: string;
  duree?: number;
}

export const moduleApi = {
  async getModules(): Promise<Module[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des modules: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  async getModuleById(id: string): Promise<Module> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du module: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  async createModule(data: CreateModuleData): Promise<Module> {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
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

  async updateModule(id: string, data: UpdateModuleData): Promise<Module> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
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
      throw new Error(`Erreur lors de la mise à jour du module: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  async deleteModule(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du module: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },
};