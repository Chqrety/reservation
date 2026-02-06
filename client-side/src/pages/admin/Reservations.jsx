import React, { useState, useEffect } from 'react'
import Api from '../../api'

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [message, setMessage] = useState(null)

  const fetchReservations = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterDate) params.append('date', filterDate)
      if (filterLocation) params.append('location_id', filterLocation)

      const response = await Api.get(`/reservations/filter/check?${params.toString()}`)

      if (response.data && response.data.data) {
        setReservations(response.data.data)
      }
    } catch (error) {
      console.error('Error fetch reservations:', error)
      setMessage({ type: 'error', text: 'Gagal mengambil data reservasi.' })
    }
    setIsLoading(false)
  }

  const fetchLocations = async () => {
    try {
      const response = await Api.get('/location/filter/check')
      if (response.data && response.data.data) {
        setLocations(response.data.data)
      }
    } catch (error) {
      console.error('Gagal load lokasi', error)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReservations()
    }, 500)
    return () => clearTimeout(timeout)
  }, [search, filterDate, filterLocation])

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data reservasi ini secara permanen?')) return

    try {
      await Api.delete(`/reservations/${id}`)
      setMessage({ type: 'success', text: 'Data reservasi berhasil dihapus!' })
      fetchReservations()
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus data. Silakan coba lagi.' })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Reservasi Gedung</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
          Total: {reservations.length} Pesanan
        </span>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 rounded-lg font-medium shadow-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {message.text}
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Cari Pelanggan / Order ID</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Ketik nama atau ORD-..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Filter Lokasi Gedung</label>
          <select
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
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
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Filter Tanggal Sewa</label>
          <input
            type="date"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Order Details</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Informasi Pelanggan</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Lokasi Gedung</th>
              <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Catatan</th>
              <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400 italic">
                  Menghubungkan ke server...
                </td>
              </tr>
            ) : reservations.length > 0 ? (
              reservations.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition">
                  <td className="p-4">
                    <div className="text-sm font-black text-blue-600 uppercase">{item.order_number}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{item.reservation_date}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{item.customer_name}</div>
                    <div className="text-xs text-gray-500">{item.phone_number}</div>
                  </td>
                  <td className="p-4">
                    {/* PERBAIKAN: Gunakan item.location.name (Bukan title) */}
                    <div className="text-sm font-medium text-gray-700">
                      {item.location?.name || 'Lokasi tidak ditemukan'}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-gray-500 max-w-xs truncate italic">
                      {item.note ? `"${item.note}"` : '-'}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-50 text-red-600 px-4 py-1 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition shadow-sm"
                    >
                      Batalkan / Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">
                  Tidak ada data reservasi yang ditemukan untuk kriteria ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
