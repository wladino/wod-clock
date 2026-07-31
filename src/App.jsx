import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tabata from './pages/Tabata';
import ForTime from './pages/ForTime';
import Emom from './pages/Emom';
import Amrap from './pages/Amrap';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tabata" element={<Tabata />} />
        <Route path="/fortime" element={<ForTime />} />
        <Route path="/emom" element={<Emom />} />
        <Route path="/amrap" element={<Amrap />} />
      </Routes>
    </BrowserRouter>
  );
}
