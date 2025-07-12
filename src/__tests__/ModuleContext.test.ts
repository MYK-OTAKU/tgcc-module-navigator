import React from 'react';
import { render } from '@testing-library/react';
import { ModuleProvider, useModuleContext, Module } from '../contexts/ModuleContext';

// Mock des données de test
const mockModule1: Module = { id: '1', nom: 'Module 1', duree: 10 };
const mockModule2: Module = { id: '2', nom: 'Module 2', duree: 20 };

// Composant de test pour tester le contexte
const TestComponent: React.FC<{ onStateChange?: (state: any) => void }> = ({ onStateChange }) => {
  const { state, dispatch } = useModuleContext();
  
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  return (
    <div>
      <div data-testid="module-count">{state.modules.length}</div>
      <div data-testid="loading">{state.loading.toString()}</div>
      <div data-testid="error">{state.error || 'null'}</div>
      <button
        data-testid="add-module"
        onClick={() => dispatch({ type: 'ADD_MODULE', payload: mockModule1 })}
      >
        Add Module
      </button>
      <button
        data-testid="set-loading"
        onClick={() => dispatch({ type: 'SET_LOADING', payload: true })}
      >
        Set Loading
      </button>
      <button
        data-testid="set-error"
        onClick={() => dispatch({ type: 'SET_ERROR', payload: 'Test error' })}
      >
        Set Error
      </button>
    </div>
  );
};

const renderWithProvider = (onStateChange?: (state: any) => void) => {
  return render(
    <ModuleProvider>
      <TestComponent onStateChange={onStateChange} />
    </ModuleProvider>
  );
};

describe('ModuleContext', () => {
  test('should provide initial state', () => {
    let capturedState: any;
    const { getByTestId } = renderWithProvider((state) => {
      capturedState = state;
    });

    expect(capturedState).toEqual({
      modules: [],
      loading: false,
      error: null,
    });
    
    expect(getByTestId('module-count')).toHaveTextContent('0');
    expect(getByTestId('loading')).toHaveTextContent('false');
    expect(getByTestId('error')).toHaveTextContent('null');
  });

  test('should handle ADD_MODULE action', () => {
    let capturedState: any;
    const { getByTestId } = renderWithProvider((state) => {
      capturedState = state;
    });

    const addButton = getByTestId('add-module');
    addButton.click();

    expect(capturedState.modules).toHaveLength(1);
    expect(capturedState.modules[0]).toEqual(mockModule1);
  });

  test('should handle SET_LOADING action', () => {
    let capturedState: any;
    const { getByTestId } = renderWithProvider((state) => {
      capturedState = state;
    });

    const loadingButton = getByTestId('set-loading');
    loadingButton.click();

    expect(capturedState.loading).toBe(true);
  });

  test('should handle SET_ERROR action', () => {
    let capturedState: any;
    const { getByTestId } = renderWithProvider((state) => {
      capturedState = state;
    });

    const errorButton = getByTestId('set-error');
    errorButton.click();

    expect(capturedState.error).toBe('Test error');
    expect(capturedState.loading).toBe(false);
  });

  test('should throw error when useModuleContext is used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useModuleContext must be used within a ModuleProvider');
    
    consoleSpy.mockRestore();
  });
});
