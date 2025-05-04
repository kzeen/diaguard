import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import PredictPage from './pages/PredictPage';
import PredictionResultPage from './pages/PredictionResultPage';
import ExplanationPage from './pages/ExplanationPage';
import RecommendationsPage from './pages/RecommendationsPage';
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } />
        <Route path='/signup' element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        } />
      </Route>

      {/* Authenticated Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/predict' element={<PredictPage />} />
        <Route path='/predict/:id/result' element={<PredictionResultPage />} />
        <Route path='/predict/:id/explanation' element={<ExplanationPage />} />
        <Route path='/predict/:id/recommendations' element={<RecommendationsPage />} />
      </Route>
    </Routes>
  )
}

export default App
