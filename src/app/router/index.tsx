import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../../pages/Login';
import { Home } from '../../pages/Home';
import { Game } from '../../pages/Game';
import { Ranking } from '../../pages/Ranking';
import { NotFound } from '../../pages/NotFound';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ranking"
          element={
            <ProtectedRoute>
              <Ranking />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
