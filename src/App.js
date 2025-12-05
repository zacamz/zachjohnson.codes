import Header from './components/Header';
import About from './pages/About';
import Links from './pages/Links';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Resume from './pages/Resume';
import Projects from './pages/Projects';
import Decide from './pages/Decide';
import Waves from './pages/Waves';
import Rain from './components/Rain'
import BdayCountDown from './pages/BdayCountDay';

function App() {
  return (
    <div className="App">
       <Header/>
      <Routes>
        <Route path="About" element={<About />}/>
        <Route path="Links" element={<Links />}/>
        <Route path='Resume' element={<Resume />}/>
        <Route path='Projects' element={<Projects />}/>
        <Route path='Decide' element={<Decide />}/>
        <Route path='Waves' element={<Waves />}/>
        <Route path='Rain' element={<Rain />}/>
        <Route path='BdayCountDown' element={<BdayCountDown />}/>
      </Routes>
    </div>
  );
}

export default App;
