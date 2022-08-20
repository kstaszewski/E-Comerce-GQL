import { Routes, Route } from 'react-router-dom';
import './App.css';
import TopBar from './components/TopBar/TopBar';

import Category from './pages/Category/Category';

function App() {
  return (
    <Routes>
      <Route element={<TopBar />}>
        <Route path="/" element={<Category />} />
      </Route>
    </Routes>
  );
}

export default App;
