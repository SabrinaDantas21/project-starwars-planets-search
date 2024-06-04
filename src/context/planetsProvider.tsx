import React, { useState, useEffect } from 'react';
import PlanetsContext, { Planet } from './PlanetsContext';

export default function PlanetsProvider({ children }: { children: React.ReactNode }) {
  const [planets, setPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((response) => response.json())
      .then((data) => {
        const planetsData: Planet[] = data.results.map((planet: any) => {
          delete planet.residents;
          return planet;
        });
        setPlanets(planetsData);
      })
      .catch((error) => console.error('Erro ao buscar planetas:', error));
  }, []);

  return (
    <PlanetsContext.Provider value={ planets }>
      {children}
    </PlanetsContext.Provider>
  );
}
