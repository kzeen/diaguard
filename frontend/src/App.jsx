import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MainLayout from './layouts/MainLayout';
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout/>}>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
      </Route>

      {/* Authenticated Routes */}
      <Route element={<MainLayout/>}>
        <Route path='/dashboard' element={<DashboardPage/>} />
      </Route>
    </Routes>
  )
}

export default App
