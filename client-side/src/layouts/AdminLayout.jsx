import { Outlet, Navigate, useNavigate, Link } from 'react-router-dom'
import Api from '../api'

export default function AdminLayout() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar?')) return

    try {
      await Api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
          <p className="text-xs text-slate-400 mt-1">Halo, {user?.name || 'Admin'}</p>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className="flex items-center p-3 rounded hover:bg-slate-700 transition-colors">
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/locations"
                className="flex items-center p-3 rounded hover:bg-slate-700 transition-colors"
              >
                <span className="font-medium">Manajemen Lokasi</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categories"
                className="flex items-center p-3 rounded hover:bg-slate-700 transition-colors"
              >
                <span className="font-medium">Kategori Lokasi</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reservations"
                className="flex items-center p-3 rounded hover:bg-slate-700 transition-colors"
              >
                <span className="font-medium">Daftar Pemesanan</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 bg-red-600 hover:bg-red-700 rounded text-white font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
