import { createContext, useContext, Dispatch, SetStateAction } from 'react';

export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  films: string[];
  created: string;
  edited: string;
  url: string;
}

interface PlanetsContextType {
  planets: Planet[];
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
}

const PlanetsContext = createContext<PlanetsContextType | undefined>(undefined);

export const usePlanets = () => {
  const context = useContext(PlanetsContext);
  if (!context) {
    throw new Error('usePlanets deve ser usado dentro de um PlanetsProvider');
  }
  return context;
};

export default PlanetsContext;
