import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Module {
  id: string;
  nom: string;
  duree: number;
}

interface ModuleState {
  modules: Module[];
  loading: boolean;
  error: string | null;
}

type ModuleAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_MODULES'; payload: Module[] }
  | { type: 'ADD_MODULE'; payload: Module }
  | { type: 'UPDATE_MODULE'; payload: Module }
  | { type: 'DELETE_MODULE'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ModuleState = {
  modules: [],
  loading: false,
  error: null,
};

const moduleReducer = (state: ModuleState, action: ModuleAction): ModuleState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MODULES':
      return { ...state, modules: action.payload, loading: false, error: null };
    case 'ADD_MODULE':
      return { ...state, modules: [...state.modules, action.payload] };
    case 'UPDATE_MODULE':
      return {
        ...state,
        modules: state.modules.map(module =>
          module.id === action.payload.id ? action.payload : module
        ),
      };
    case 'DELETE_MODULE':
      return {
        ...state,
        modules: state.modules.filter(module => module.id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Export du reducer pour les tests
export { moduleReducer };

interface ModuleContextType {
  state: ModuleState;
  dispatch: React.Dispatch<ModuleAction>;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(moduleReducer, initialState);

  return (
    <ModuleContext.Provider value={{ state, dispatch }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModuleContext = () => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModuleContext must be used within a ModuleProvider');
  }
  return context;
};