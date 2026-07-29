import Header from './components/Header';
import About from './pages/About';
import Links from './pages/Links';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Resume from './pages/Resume';
import Now from './pages/Now';
import Projects from './pages/Projects';
import Decide from './pages/Decide';
import Waves from './pages/Waves';
import Rain from './components/Rain'
import RandomWalk from './components/Walker'
import BdayCountDown from './pages/BdayCountDay';
import LatinSquare from './pages/LatinSquare';
import CodingTrain from './pages/CodingTrain';
import Art from './pages/ArtQuestionMark'
import Wheel from './pages/Wheel';
import Tuner from './pages/Tuner';

function App() {
  return (
    <div className="App">
       <Header/>
      <Routes>
        <Route path="About" element={<About />}/>
        <Route path="Links" element={<Links />}/>
        <Route path='Resume' element={<Resume />}/>
        <Route path='ArtQuestionMark' element={<Art />}/>
        <Route path='Decide' element={<Decide />}/>
        <Route path='Now' element={<Now />}/>
        <Route path='Waves' element={<Waves />}/>
        <Route path='Rain' element={<Rain />}/>
        <Route path='BdayCountDown' element={<BdayCountDown />}/>
        <Route path='LatinSquare' element={<LatinSquare />}/>
        <Route path='Walker' element={<RandomWalk />}/>
        <Route path='CodingTrain' element={<CodingTrain />}/>
        <Route path='Wheel' element={<Wheel />}/>
        <Route path='Tuner' element={<Tuner />}/>
      </Routes>
    </div>
  );
}

export default App;
