import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MainLayout from './layouts/MainLayout';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route element={<MainLayout/>}>
        <Route path='/dashboard' element={<DashboardPage/>} />
      </Route>
    </Routes>
  )
}

export default App
