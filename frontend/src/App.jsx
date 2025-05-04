import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout/>}>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={
          <GuestRoute>
            <LoginPage/>
          </GuestRoute>
        } />
        <Route path='/signup' element={
          <GuestRoute>
            <SignupPage/>
          </GuestRoute>
        } />
      </Route>

      {/* Authenticated Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout/>
        </ProtectedRoute>
      }>
        <Route path='/dashboard' element={<DashboardPage/>} />
      </Route>
    </Routes>
  )
}

export default App
