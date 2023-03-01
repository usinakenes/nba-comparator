import './App.css';
import Navbar from './components/Navbar/Navbar';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import Games from './pages/Games/Games';
import PlayerStats from './pages/PlayerStats/PlayerStats';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<h1>Please select one of the above.</h1>}/>
        <Route path='/games' element={<Games />}/>
        <Route path='/playerStats' element={<PlayerStats />}/>
      </Routes>
      
    </div>
  );
}

export default App;
