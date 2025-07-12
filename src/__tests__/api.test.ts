import { moduleApi } from '../services/api';

// Mock fetch globalement
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Module API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getModules', () => {
    test('should fetch modules successfully', async () => {
      const mockModules = [
        { id: '1', nom: 'Module 1', duree: 10 },
        { id: '2', nom: 'Module 2', duree: 20 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockModules,
      });

      const result = await moduleApi.getModules();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://68719baa76a5723aacd25f94.mockapi.io/api/tgcc/'
      );
      expect(result).toEqual(mockModules);
    });

    test('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(moduleApi.getModules()).rejects.toThrow('Erreur lors de la récupération des modules');
    });

    test('should throw error when network fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(moduleApi.getModules()).rejects.toThrow('Erreur lors de la récupération des modules');
    });
  });

  describe('getModuleById', () => {
    test('should fetch module by id successfully', async () => {
      const mockModule = { id: '1', nom: 'Module 1', duree: 10 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockModule,
      });

      const result = await moduleApi.getModuleById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://68719baa76a5723aacd25f94.mockapi.io/api/tgcc/1'
      );
      expect(result).toEqual(mockModule);
    });

    test('should throw error when module not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(moduleApi.getModuleById('999')).rejects.toThrow('Erreur lors de la récupération du module');
    });
  });

  describe('createModule', () => {
    test('should create module successfully', async () => {
      const newModuleData = { nom: 'New Module', duree: 15 };
      const createdModule = { id: '3', ...newModuleData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdModule,
      });

      const result = await moduleApi.createModule(newModuleData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://68719baa76a5723aacd25f94.mockapi.io/api/tgcc/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newModuleData),
        }
      );
      expect(result).toEqual(createdModule);
    });

    test('should throw error when creation fails', async () => {
      const newModuleData = { nom: 'New Module', duree: 15 };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(moduleApi.createModule(newModuleData)).rejects.toThrow('Erreur lors de la création du module');
    });
  });

  describe('updateModule', () => {
    test('should update module successfully', async () => {
      const updateData = { nom: 'Updated Module', duree: 25 };
      const updatedModule = { id: '1', ...updateData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedModule,
      });

      const result = await moduleApi.updateModule('1', updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://68719baa76a5723aacd25f94.mockapi.io/api/tgcc/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );
      expect(result).toEqual(updatedModule);
    });

    test('should throw error when update fails', async () => {
      const updateData = { nom: 'Updated Module' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(moduleApi.updateModule('999', updateData)).rejects.toThrow('Erreur lors de la mise à jour du module');
    });
  });

  describe('deleteModule', () => {
    test('should delete module successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await moduleApi.deleteModule('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://68719baa76a5723aacd25f94.mockapi.io/api/tgcc/1',
        {
          method: 'DELETE',
        }
      );
    });

    test('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(moduleApi.deleteModule('999')).rejects.toThrow('Erreur lors de la suppression du module');
    });

    test('should throw error when network fails during deletion', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(moduleApi.deleteModule('1')).rejects.toThrow('Erreur lors de la suppression du module');
    });
  });
});
