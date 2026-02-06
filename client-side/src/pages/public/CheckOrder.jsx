import React, { useState } from 'react'
import Api from '../../api'

export default function CheckOrder() {
  // State Input Pencarian
  const [orderNumber, setOrderNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // State Data & UI
  const [orderDetail, setOrderDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fungsi Handle Pencarian Pesanan
  const handleCheckOrder = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setOrderDetail(null)

    try {
      // Mengirim data ke API check reservation
      const response = await Api.post('/reservations/check', {
        order_number: orderNumber,
        phone_number: phoneNumber,
      })

      if (response.data && response.data.success) {
        setOrderDetail(response.data.data)
      } else {
        setError('Data pemesanan tidak ditemukan. Pastikan nomor order dan HP benar.')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencari data. Silakan coba lagi.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Cek Status Pemesanan</h2>
          <p className="text-gray-500 mt-2">Masukkan detail pesanan Anda untuk melihat status terbaru</p>
        </div>

        {/* Form Pencarian */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <form onSubmit={handleCheckOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nomor Order</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: ORD-12345"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="number"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="08123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:bg-gray-400"
            >
              {isLoading ? 'Mencari...' : 'LIHAT DETAIL PESANAN'}
            </button>
          </form>
          {error && <p className="mt-4 text-center text-red-500 text-sm font-medium">{error}</p>}
        </div>

        {/* Tampilan Detail Pesanan (Muncul jika ditemukan) */}
        {orderDetail && (
          <div className="bg-white rounded-2xl shadow-lg border-t-8 border-blue-600 overflow-hidden animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Detail Reservasi</h3>
                  <p className="text-2xl font-black text-blue-600">{orderDetail.order_number}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Terkonfirmasi
                </span>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama Pelanggan</span>
                  <span className="font-semibold text-gray-800">{orderDetail.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gedung / Lokasi</span>
                  <span className="font-semibold text-gray-800">{orderDetail.location?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal Sewa</span>
                  <span className="font-semibold text-gray-800">{orderDetail.reservation_date}</span>
                </div>
                <div className="flex justify-between border-t pt-4 mt-4">
                  <span className="text-gray-500">Nomor Telepon</span>
                  <span className="font-semibold text-gray-800">{orderDetail.phone_number}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-400 italic">
                Harap tunjukkan halaman ini kepada petugas saat hari pelaksanaan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
