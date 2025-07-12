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
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

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