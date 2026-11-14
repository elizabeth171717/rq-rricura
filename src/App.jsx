import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from './pages/MenuPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/menu/panchos-mexican-restaurant" replace />}
        />

        <Route path="/menu/:slug" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
