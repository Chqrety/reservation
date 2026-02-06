import React, { useState } from 'react'
import Api from '../../api'

export default function CheckOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [orderDetail, setOrderDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCheckOrder = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setOrderDetail(null)

    // Sanitasi input: hapus spasi di depan/belakang
    const payload = {
      order_number: orderNumber.trim(),
      phone_number: String(phoneNumber).trim(), // Pastikan dikirim sebagai string
    }

    try {
      const response = await Api.post('/reservations/check', payload)

      // DEBUG: Lihat apa isi response dari server di console
      console.log('Response Check Order:', response.data)

      if (response.data) {
        setOrderDetail(response.data.data)
      } else {
        setError('Data pemesanan tidak ditemukan. Cek kembali Nomor Order dan nomor WhatsApp Anda.')
      }
    } catch (err) {
      console.error('Error Detail:', err.response?.data)

      if (err.response && err.response.status === 404) {
        setError('Pemesanan tidak ditemukan di database kami.')
      } else {
        setError('Terjadi kesalahan koneksi ke server. Silakan coba lagi nanti.')
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Cek Status Pemesanan</h2>
          <p className="text-gray-500 mt-2">Gunakan Nomor Order Anda untuk melihat rincian reservasi</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <form onSubmit={handleCheckOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nomor Order</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
                  placeholder="Contoh: ORD-XXXXXXXX"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="text" // Diubah ke text agar string sanitasi lebih mudah
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:bg-gray-400"
            >
              {isLoading ? 'Mencari Data...' : 'CARI PESANAN'}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium border border-red-100">
              {error}
            </div>
          )}
        </div>

        {orderDetail && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-600 p-6 text-white text-center">
              <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-1">Status Reservasi</p>
              <h3 className="text-3xl font-black">{orderDetail.order_number}</h3>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-gray-400 text-sm">Nama Pelanggan</span>
                  <span className="font-bold text-gray-800 text-right">{orderDetail.customer_name}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-gray-400 text-sm">Gedung / Lokasi</span>
                  <span className="font-bold text-blue-600 text-right">
                    {orderDetail.location?.name || 'Data Lokasi Hilang'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-gray-400 text-sm">Tanggal Pelaksanaan</span>
                  <span className="font-bold text-gray-800 text-right">{orderDetail.reservation_date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Nomor WhatsApp</span>
                  <span className="font-bold text-gray-800 text-right">{orderDetail.phone_number}</span>
                </div>

                {orderDetail.note && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <span className="text-[10px] font-black text-yellow-600 uppercase block mb-1">
                      Catatan Tambahan:
                    </span>
                    <p className="text-gray-700 text-sm italic">"{orderDetail.note}"</p>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-dashed text-center">
                <p className="text-xs text-gray-400">Simpan halaman ini sebagai bukti reservasi yang sah.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
