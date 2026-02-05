import React, { useState, useEffect } from 'react'
import Api from '../../api'

export default function Reservations() {
  // --- STATE ---
  const [reservations, setReservations] = useState([])
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // State Filter & Search
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterLocation, setFilterLocation] = useState('')

  // State Notifikasi
  const [message, setMessage] = useState(null)

  // --- FETCH DATA RESERVASI ---
  // Menggunakan endpoint /filter/check sesuai route backend kamu
  const fetchReservations = async () => {
    setIsLoading(true)
    try {
      // Build Query Params
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterDate) params.append('date', filterDate)
      if (filterLocation) params.append('location_id', filterLocation)

      // REQUEST KE: GET /api/reservations/filter/check
      const response = await Api.get(`/reservations/filter/check?${params.toString()}`)

      // Backend mengembalikan { data: [...] }
      if (response.data && response.data.data) {
        setReservations(response.data.data)
      } else if (Array.isArray(response.data)) {
        // Jaga-jaga kalau backend langsung return array
        setReservations(response.data)
      }
    } catch (error) {
      console.error('Error fetch reservations:', error)
      if (error.response && error.response.status === 404) {
        setMessage({
          type: 'error',
          text: 'Error 404: Route /reservations/filter/check tidak ditemukan. Cek php artisan route:list',
        })
      } else {
        setMessage({ type: 'error', text: 'Gagal mengambil data reservasi.' })
      }
    }
    setIsLoading(false)
  }

  // --- FETCH DATA LOKASI (Untuk Dropdown) ---
  // Menggunakan endpoint /location (Singular/Tunggal) sesuai Public Route
  const fetchLocations = async () => {
    try {
      // PERBAIKAN: Gunakan endpoint /filter/check yang return Array (bukan Paginasi)
      const response = await Api.get('/location/filter/check')

      if (response.data && response.data.data) {
        setLocations(response.data.data) // Sekarang ini pasti Array
      }
    } catch (error) {
      console.error('Gagal load lokasi', error)
    }
  }

  // Load data awal
  useEffect(() => {
    fetchLocations()
  }, [])

  // Refresh data saat filter berubah
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReservations()
    }, 500) // Debounce biar gak spam request
    return () => clearTimeout(timeout)
  }, [search, filterDate, filterLocation])

  // --- DELETE HANDLER ---
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return

    try {
      await Api.delete(`/reservations/${id}`)
      setMessage({ type: 'success', text: 'Data berhasil dihapus!' })
      fetchReservations()
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus data.' })
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Reservasi</h2>

      {/* Notifikasi */}
      {message && (
        <div
          className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {message.text}
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-bold text-gray-600 block mb-1">Cari (Order ID / Nama)</label>
          <input
            type="text"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ketiko sesuatu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="md:w-1/4">
          <label className="text-sm font-bold text-gray-600 block mb-1">Lokasi</label>
          <select
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">Semua Lokasi</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:w-1/4">
          <label className="text-sm font-bold text-gray-600 block mb-1">Tanggal</label>
          <input
            type="date"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-600">Order ID</th>
              <th className="p-4 text-left font-semibold text-gray-600">Pelanggan</th>
              <th className="p-4 text-left font-semibold text-gray-600">Lokasi</th>
              <th className="p-4 text-left font-semibold text-gray-600">Tanggal</th>
              <th className="p-4 text-center font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Sedang memuat data...
                </td>
              </tr>
            ) : reservations.length > 0 ? (
              reservations.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-blue-600 font-bold">{item.order_number}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{item.customer_name}</div>
                    <div className="text-xs text-gray-500">{item.phone_number}</div>
                  </td>
                  <td className="p-4">{item.location ? item.location.title : '-'}</td>
                  <td className="p-4">{item.reservation_date}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Belum ada data reservasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
