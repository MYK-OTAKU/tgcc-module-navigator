import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModuleProvider } from '../contexts/ModuleContext';
import AddModule from '../components/AddModule';
import { moduleApi } from '../services/api';
import { toast } from 'sonner';

// Mock des dépendances
jest.mock('../services/api');
jest.mock('sonner');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockedModuleApi = jest.mocked(moduleApi);
const mockedToast = jest.mocked(toast);

const renderAddModule = () => {
  return render(
    <MemoryRouter>
      <ModuleProvider>
        <AddModule />
      </ModuleProvider>
    </MemoryRouter>
  );
};

describe('AddModule Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders add module form correctly', () => {
    renderAddModule();
    
    expect(screen.getByText('Créer un nouveau module')).toBeInTheDocument();
    expect(screen.getByLabelText(/nom du module/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/durée.*heures/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer le module/i })).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', async () => {
    renderAddModule();
    
    const submitButton = screen.getByRole('button', { name: /créer le module/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le nom du module est requis')).toBeInTheDocument();
      expect(screen.getByText('La durée est requise')).toBeInTheDocument();
    });
  });

  test('displays validation error for short module name', async () => {
    renderAddModule();
    
    const nameInput = screen.getByLabelText(/nom du module/i);
    fireEvent.change(nameInput, { target: { value: 'AB' } });
    
    const submitButton = screen.getByRole('button', { name: /créer le module/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Le nom doit contenir au moins 3 caractères')).toBeInTheDocument();
    });
  });

  test('displays validation error for invalid duration', async () => {
    renderAddModule();
    
    const durationInput = screen.getByLabelText(/durée.*heures/i);
    fireEvent.change(durationInput, { target: { value: '-5' } });
    
    const submitButton = screen.getByRole('button', { name: /créer le module/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La durée doit être un nombre positif')).toBeInTheDocument();
    });
  });

  test('successfully creates a module', async () => {
    const mockModule = {
      id: '1',
      nom: 'Test Module',
      duree: 10
    };

    mockedModuleApi.createModule.mockResolvedValue(mockModule);
    
    renderAddModule();
    
    const nameInput = screen.getByLabelText(/nom du module/i);
    const durationInput = screen.getByLabelText(/durée.*heures/i);
    const submitButton = screen.getByRole('button', { name: /créer le module/i });

    fireEvent.change(nameInput, { target: { value: 'Test Module' } });
    fireEvent.change(durationInput, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedModuleApi.createModule).toHaveBeenCalledWith({
        nom: 'Test Module',
        duree: 10
      });
      expect(mockedToast.success).toHaveBeenCalledWith('Module "Test Module" créé avec succès !');
    });
  });

  test('handles API error gracefully', async () => {
    const errorMessage = 'Erreur API';
    mockedModuleApi.createModule.mockRejectedValue(new Error(errorMessage));
    
    renderAddModule();
    
    const nameInput = screen.getByLabelText(/nom du module/i);
    const durationInput = screen.getByLabelText(/durée.*heures/i);
    const submitButton = screen.getByRole('button', { name: /créer le module/i });

    fireEvent.change(nameInput, { target: { value: 'Test Module' } });
    fireEvent.change(durationInput, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('disables submit button when form is invalid', () => {
    renderAddModule();
    
    const submitButton = screen.getByRole('button', { name: /créer le module/i });
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when form is valid', () => {
    renderAddModule();
    
    const nameInput = screen.getByLabelText(/nom du module/i);
    const durationInput = screen.getByLabelText(/durée.*heures/i);

    fireEvent.change(nameInput, { target: { value: 'Test Module' } });
    fireEvent.change(durationInput, { target: { value: '10' } });

    const submitButton = screen.getByRole('button', { name: /créer le module/i });
    expect(submitButton).not.toBeDisabled();
  });
});
