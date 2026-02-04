import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="font-sans text-gray-800">
      <nav className="bg bg-blue-600 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Reservasi Online</h1>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
