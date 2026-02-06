import React, { useState, useEffect } from 'react'
import Api from '../../api'

export default function Dashboard() {
  // State untuk menampung jumlah data
  const [stats, setStats] = useState({
    categories: 0,
    locations: 0,
    reservations: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // Mengambil data dari berbagai endpoint secara paralel
      const [resCats, resLocs, resOrders] = await Promise.all([
        Api.get('/locations-categories'),
        Api.get('/location/filter/check'),
        Api.get('/reservations/filter/check'),
      ])

      setStats({
        categories: resCats.data.data?.length || 0,
        locations: resLocs.data.data?.length || 0,
        reservations: resOrders.data.data?.length || 0,
      })
    } catch (error) {
      console.error('Gagal memuat statistik dashboard', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Memuat data statistik...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Kategori */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="text-sm font-bold text-blue-500 uppercase mb-1">Total Kategori</div>
            <div className="text-3xl font-extrabold text-gray-800">{stats.categories}</div>
            <p className="text-gray-400 text-xs mt-2 italic">*Kategori lokasi terdaftar</p>
          </div>

          {/* Card Lokasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="text-sm font-bold text-green-500 uppercase mb-1">Total Gedung</div>
            <div className="text-3xl font-extrabold text-gray-800">{stats.locations}</div>
            <p className="text-gray-400 text-xs mt-2 italic">*Gedung yang aktif</p>
          </div>

          {/* Card Reservasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-shadow">
            <div className="text-sm font-bold text-orange-500 uppercase mb-1">Total Pesanan</div>
            <div className="text-3xl font-extrabold text-gray-800">{stats.reservations}</div>
            <p className="text-gray-400 text-xs mt-2 italic">*Seluruh riwayat reservasi</p>
          </div>
        </div>
      )}

      {/* Informasi Selamat Datang */}
      <div className="mt-10 bg-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Selamat Datang, Admin!</h3>
        <p className="text-blue-100 opacity-90 max-w-2xl">
          Gunakan menu sidebar untuk mengelola data gedung, kategori, dan memantau pesanan yang masuk dari pelanggan
          secara real-time.
        </p>
      </div>
    </div>
  )
}
