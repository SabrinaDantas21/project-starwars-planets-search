import './App.css';
import FilteredTable from './components/FilteredTable';
import PlanetsProvider from './context/PlanetsContext';

function App() {
  return (
    <PlanetsProvider>
      <div className="App">
        <FilteredTable />
      </div>
    </PlanetsProvider>
  );
}

export default App;
