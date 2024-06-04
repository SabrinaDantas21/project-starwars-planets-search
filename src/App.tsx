import './App.css';
import Table from './components/Table';
import PlanetsProvider from './context/planetsProvider';

function App() {
  return (
    <PlanetsProvider>
      <div className="App">
        <Table />
      </div>
    </PlanetsProvider>
  );
}

export default App;
