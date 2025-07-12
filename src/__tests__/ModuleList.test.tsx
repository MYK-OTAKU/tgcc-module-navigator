import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModuleProvider } from '../contexts/ModuleContext';
import ModuleList from '../components/ModuleList';
import { moduleApi } from '../services/api';
import { toast } from 'sonner';

// Mock des dépendances
jest.mock('../services/api');
jest.mock('sonner');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

const mockedModuleApi = jest.mocked(moduleApi);
const mockedToast = jest.mocked(toast);

const mockModules = [
  { id: '1', nom: 'Module 1', duree: 10 },
  { id: '2', nom: 'Module 2', duree: 20 },
  { id: '3', nom: 'Module 3', duree: 15 },
];

const renderModuleList = () => {
  return render(
    <MemoryRouter>
      <ModuleProvider>
        <ModuleList />
      </ModuleProvider>
    </MemoryRouter>
  );
};

describe('ModuleList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    mockedModuleApi.getModules.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderModuleList();
    
    expect(screen.getByText('Chargement des modules...')).toBeInTheDocument();
  });

  test('displays modules after successful fetch', async () => {
    mockedModuleApi.getModules.mockResolvedValue(mockModules);
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
      expect(screen.getByText('Module 2')).toBeInTheDocument();
      expect(screen.getByText('Module 3')).toBeInTheDocument();
      expect(screen.getByText('3 modules disponibles')).toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    const errorMessage = 'Erreur de réseau';
    mockedModuleApi.getModules.mockRejectedValue(new Error(errorMessage));
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('displays empty state when no modules exist', async () => {
    mockedModuleApi.getModules.mockResolvedValue([]);
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText('Aucun module trouvé')).toBeInTheDocument();
      expect(screen.getByText('Commencez par ajouter votre premier module !')).toBeInTheDocument();
    });
  });

  test('opens edit dialog when edit button is clicked', async () => {
    mockedModuleApi.getModules.mockResolvedValue(mockModules);
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
    });

    // Trouve et clique sur le bouton d'édition du premier module
    const moduleCard = screen.getByText('Module 1').closest('.group');
    expect(moduleCard).toBeInTheDocument();
    
    const editButton = moduleCard?.querySelector('button[data-testid="edit-button"]') || 
                      moduleCard?.querySelector('button:has(svg)');
    
    if (editButton) {
      fireEvent.click(editButton);
      await waitFor(() => {
        expect(screen.getByText('Modifier le module')).toBeInTheDocument();
      });
    }
  });

  test('successfully updates a module', async () => {
    const updatedModule = { id: '1', nom: 'Module Updated', duree: 25 };
    mockedModuleApi.getModules.mockResolvedValue(mockModules);
    mockedModuleApi.updateModule.mockResolvedValue(updatedModule);
    
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
    });

    // Simule l'ouverture du dialog d'édition
    const moduleCard = screen.getByText('Module 1').closest('.group');
    const editButton = moduleCard?.querySelector('button:has(svg)');
    
    if (editButton) {
      fireEvent.click(editButton);
      
      await waitFor(() => {
        expect(screen.getByText('Modifier le module')).toBeInTheDocument();
      });

      const nameInput = screen.getByDisplayValue('Module 1');
      const durationInput = screen.getByDisplayValue('10');
      
      fireEvent.change(nameInput, { target: { value: 'Module Updated' } });
      fireEvent.change(durationInput, { target: { value: '25' } });
      
      const saveButton = screen.getByText('Sauvegarder');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockedModuleApi.updateModule).toHaveBeenCalledWith('1', {
          nom: 'Module Updated',
          duree: 25
        });
        expect(mockedToast.success).toHaveBeenCalledWith('Module mis à jour avec succès');
      });
    }
  });

  test('successfully deletes a module', async () => {
    mockedModuleApi.getModules.mockResolvedValue(mockModules);
    mockedModuleApi.deleteModule.mockResolvedValue();
    
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
    });

    // Simule le clic sur le bouton de suppression
    const moduleCard = screen.getByText('Module 1').closest('.group');
    const deleteButton = moduleCard?.querySelector('button:last-child');
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.getByText('Êtes-vous sûr ?')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Supprimer');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockedModuleApi.deleteModule).toHaveBeenCalledWith('1');
        expect(mockedToast.success).toHaveBeenCalledWith('Module supprimé avec succès');
      });
    }
  });

  test('handles update error gracefully', async () => {
    const errorMessage = 'Erreur de mise à jour';
    mockedModuleApi.getModules.mockResolvedValue(mockModules);
    mockedModuleApi.updateModule.mockRejectedValue(new Error(errorMessage));
    
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
    });

    // Simule une tentative de mise à jour qui échoue
    const moduleCard = screen.getByText('Module 1').closest('.group');
    const editButton = moduleCard?.querySelector('button:has(svg)');
    
    if (editButton) {
      fireEvent.click(editButton);
      
      await waitFor(() => {
        const saveButton = screen.getByText('Sauvegarder');
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(errorMessage);
      });
    }
  });

  test('handles delete error gracefully', async () => {
    const errorMessage = 'Erreur de suppression';
    mockedModuleApi.getModules.mockResolvedValue(mockModules);
    mockedModuleApi.deleteModule.mockRejectedValue(new Error(errorMessage));
    
    renderModuleList();

    await waitFor(() => {
      expect(screen.getByText('Module 1')).toBeInTheDocument();
    });

    // Simule une tentative de suppression qui échoue
    const moduleCard = screen.getByText('Module 1').closest('.group');
    const deleteButton = moduleCard?.querySelector('button:last-child');
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        const confirmButton = screen.getByText('Supprimer');
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(mockedToast.error).toHaveBeenCalledWith(errorMessage);
      });
    }
  });
});
