import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Api from '../../api'

export default function OrderForm() {
  const { id } = useParams()

  const [location, setLocation] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [reservationDate, setReservationDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState({})
  const [message, setMessage] = useState(null)

  const fetchLocationDetail = async () => {
    try {
      const response = await Api.get(`/location/${id}`)
      if (response.data && response.data.success) {
        const dataGedung = response.data.data
        setLocation(dataGedung)
        setAddress(dataGedung.address || '')
      }
    } catch (error) {
      console.error('Gagal memuat detail lokasi', error)
      setMessage({ type: 'error', text: 'Gagal memuat data gedung.' })
    }
  }

  useEffect(() => {
    fetchLocationDetail()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setValidation({})
    setMessage(null)

    const payload = {
      location_id: parseInt(id),
      customer_name: customerName,
      phone_number: phoneNumber,
      address: address,
      date: reservationDate,
      user_id: 1,
    }

    try {
      const response = await Api.post('/reservations/store', payload)

      if (response.data && response.data.success) {
        setMessage({
          type: 'success',
          text: `Berhasil! Order ID Anda: ${response.data.data.order_number}`,
        })

        setCustomerName('')
        setPhoneNumber('')
        setReservationDate('')
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidation(error.response.data.errors)
        console.error('Validasi Gagal:', error.response.data.errors)
      } else {
        console.error('Server Error:', error)
        setMessage({
          type: 'error',
          text: 'Terjadi kesalahan sistem (500).',
        })
      }
    }
    setIsLoading(false)
  }

  if (!location) return <div className="p-10 text-center font-bold text-gray-500">Memuat detail gedung...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-56 object-cover rounded-xl mb-4 shadow-sm"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400?text=No+Image'
            }}
          />
          <h2 className="text-2xl font-bold text-gray-800">{location.name}</h2>
          <p className="text-gray-500 text-sm mt-1 mb-4 flex items-center gap-1">📍 {location.address}</p>
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 leading-relaxed">
            <span className="font-bold block mb-1">Deskripsi:</span>
            {location.description}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 h-fit">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Formulir Reservasi</h3>

          {message && (
            <div
              className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                className={`w-full border p-3 rounded-lg outline-none transition-all ${validation.customer_name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                placeholder="Masukkan nama lengkap Anda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              {validation.customer_name && (
                <small className="text-red-600 text-xs mt-1 block">{validation.customer_name[0]}</small>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
              <input
                type="number"
                className={`w-full border p-3 rounded-lg outline-none transition-all ${validation.phone_number ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                placeholder="Contoh: 08123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {validation.phone_number && (
                <small className="text-red-600 text-xs mt-1 block">{validation.phone_number[0]}</small>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Sewa</label>
              <input
                type="date"
                className={`w-full border p-3 rounded-lg outline-none transition-all ${validation.date ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
              />
              {validation.date && <small className="text-red-600 text-xs mt-1 block">{validation.date[0]}</small>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Alamat Lengkap <span className="text-gray-400 font-normal text-xs">(Min. 10 karakter)</span>
              </label>
              <textarea
                rows="2"
                className={`w-full border p-3 rounded-lg outline-none transition-all ${validation.address ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Detail alamat..."
              ></textarea>
              {validation.address && <small className="text-red-600 text-xs mt-1 block">{validation.address[0]}</small>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isLoading ? 'Sedang Memproses...' : 'KONFIRMASI PEMESANAN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
