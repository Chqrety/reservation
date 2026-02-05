import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

import Login from './pages/auth/Login'
import LandingPage from './pages/public/LandingPage'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Locations from './pages/admin/Locations'
import Reservations from './pages/admin/Reservations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="locations" element={<Locations />} />
          <Route path="reservations" element={<Reservations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
