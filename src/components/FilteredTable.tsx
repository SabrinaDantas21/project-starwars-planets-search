import { useState, useEffect } from 'react';
import { usePlanets, Planet } from '../context/PlanetsContext';

type PlanetProperty = 'name' | 'population' | 'orbital_period' |
'diameter' | 'rotation_period' | 'surface_water';

function FilteredTable() {
  const { planets, originalPlanets, applyFilter, setPlanets,
    filterText, setFilterText, clearFilters, filters, setFilters } = usePlanets();
  const [selectedColumn, setSelectedColumn] = useState<string>('population');
  const [comparisonOperator, setComparisonOperator] = useState<'maior que'
  | 'menor que' | 'igual a'>('maior que');
  const [filterValue, setFilterValue] = useState('0');
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [filteredColumns, setFilteredColumns] = useState<string[]>([]);

  useEffect(() => {
    if (originalPlanets.length > 0) {
      const columns = Object.keys(originalPlanets[0]);
      setAvailableColumns(columns.filter((column) => !filteredColumns
        .includes(column) && ['population', 'orbital_period',
        'diameter', 'rotation_period', 'surface_water'].includes(column)));
    }
  }, [originalPlanets, filteredColumns]);

  const handleFilter = () => {
    const newFilter = { column: selectedColumn,
      comparison: comparisonOperator,
      value: filterValue };
    setFilters([...filters, newFilter]);
    const updatedFilteredColumns = [...filteredColumns, selectedColumn];
    setFilteredColumns(updatedFilteredColumns);
    const value = applyFilter(selectedColumn, comparisonOperator, filterValue, planets);
    setPlanets(value);
    setAvailableColumns(availableColumns
      .filter((column) => !updatedFilteredColumns.includes(column)));
    setSelectedColumn(availableColumns[0]);
    setComparisonOperator('maior que');
    setFilterValue('0');
  };

  const resetFilter = () => {
    setFilters([]);
    setFilteredColumns([]);
    if (originalPlanets && originalPlanets.length > 0) {
      const columns = Object.keys(originalPlanets[0])
        .filter((column) => !filteredColumns.includes(column as PlanetProperty)
        && ['population', 'orbital_period',
          'diameter', 'rotation_period', 'surface_water']
          .includes(column as PlanetProperty)) as PlanetProperty[];

      setAvailableColumns(columns);
    }

    setSelectedColumn('population');
    setComparisonOperator('maior que');
    setFilterValue('0');
  };

  const removeFilter = (columnToRemove: string) => {
    const updatedFilters = filters.filter((filter) => filter.column !== columnToRemove);
    let planetFilter = originalPlanets;
    updatedFilters.forEach((filter) => {
      planetFilter = applyFilter(
        filter.column,
        filter.comparison,
        filter.value,
        planetFilter,
      );
    });
    setPlanets(planetFilter);
    setFilters(updatedFilters);
    const updatedFilteredColumns = updatedFilters.map((filter) => filter.column);
    setFilteredColumns(updatedFilteredColumns);
    const remainingColumns = availableColumns.filter((column) => {
      const isUsed = updatedFilters.some((filter) => filter.column === column);
      return !isUsed;
    });
    setAvailableColumns(remainingColumns);
  };

  const removeAllFilters = () => {
    clearFilters();
    if (originalPlanets && originalPlanets.length > 0) {
      setAvailableColumns(Object.keys(originalPlanets[0]));
    }
  };

  const filteredPlanets = planets.filter((planet) => {
    if (!filterText) return true;
    return planet.name.toLowerCase().includes(filterText.toLowerCase());
  });
  return (
    <div>
      <select
        value={ selectedColumn }
        onChange={ (e) => setSelectedColumn(e.target.value) }
        data-testid="column-filter"
      >
        {availableColumns.map((column) => (
          <option key={ column } value={ column }>
            {column}
          </option>
        ))}
      </select>

      <select
        value={ comparisonOperator }
        onChange={ (e) => setComparisonOperator(e
          .target.value as 'maior que' | 'menor que' | 'igual a') }
        data-testid="comparison-filter"
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>

      <input
        type="number"
        value={ filterValue }
        onChange={ (e) => setFilterValue(e.target.value) }
        data-testid="value-filter"
      />

      <button
        type="button"
        onClick={ handleFilter }
        data-testid="button-filter"
      >
        Filter
      </button>

      <button
        type="button"
        onClick={ resetFilter }
        data-testid="button-reset"
      >
        Reset
      </button>

      <h2>Planets Star Wars</h2>

      <button
        type="button"
        onClick={ removeAllFilters }
        data-testid="button-remove-filters"
      >
        Remover todas filtragens
      </button>
      {filters.map((filter, index) => (
        <div key={ index } data-testid="filter">
          {filter.column}
          {' '}
          {filter.comparison}
          {' '}
          {filter.value}
          <button type="button" onClick={ () => removeFilter(filter.column) }>X</button>
        </div>
      ))}

      <input
        type="text"
        placeholder="Filter by name..."
        value={ filterText }
        onChange={ (e) => setFilterText(e.target.value) }
        data-testid="name-filter"
      />
      <label htmlFor="asc">
        Ascendente
        <input
          type="radio"
          data-testid="column-sort-input-asc"
          value="ASC"
        />
      </label>
      <label htmlFor="desc">
        Descendente
        <input
          type="radio"
          data-testid="column-sort-input-desc"
          value="DESC"
        />
      </label>
      <button
        type="submit"
        data-testid="column-sort-button"
      >
        Ordenar
      </button>

      <table data-testid="planets-table">
        <thead>
          <tr>
            {planets.length > 0 && Object
              .keys(planets[0]).map((column) => (
                <th key={ column }>{column}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filteredPlanets.map((planet, index) => (
            <tr key={ index }>
              {Object.keys(planets[0]).map((column) => (
                <td key={ column }>{planet[column as keyof Planet] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilteredTable;
