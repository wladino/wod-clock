import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tabata from './pages/Tabata';
import ForTime from './pages/ForTime';
import Emom from './pages/Emom';
import Amrap from './pages/Amrap';
import ThemeToggle from './components/ThemeToggle';
import { loadTheme, saveTheme } from './lib/storage';

export default function App() {
  const [theme, setTheme] = useState(() => loadTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#dcdcdc' : '#1e1e1e');
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="app-header-bar">
        <ThemeToggle theme={theme} onToggle={setTheme} />
      </div>
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
