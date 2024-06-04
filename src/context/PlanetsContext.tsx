import { createContext, useContext } from 'react';

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

const PlanetsContext = createContext<Planet[]>([]);

export const usePlanets = () => useContext(PlanetsContext);

export default PlanetsContext;
