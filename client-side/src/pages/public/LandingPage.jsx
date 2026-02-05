import React, { useState, useEffect } from 'react'
import Api from '../../api'

export default function LandingPage() {
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // State Filter
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Menggunakan endpoint publik /filter/check sesuai api.php
      const params = new URLSearchParams()
      if (filterCategory) params.append('category_id', filterCategory)

      const response = await Api.get(`/location/filter/check?${params.toString()}`)
      if (response.data && response.data.success) {
        setLocations(response.data.data)
      }
    } catch (error) {
      console.error('Gagal mengambil data lokasi', error)
    }
    setIsLoading(false)
  }

  const fetchCategories = async () => {
    try {
      // Menggunakan endpoint publik sesuai api.php (locations-categories)
      const response = await Api.get('/locations-categories')
      if (response.data && response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error('Gagal load kategori', error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [filterCategory])

  // Logika Search Frontend (Smart Search)
  const filteredLocations = locations.filter((item) => {
    if (!search) return true
    const lowerSearch = search.toLowerCase()
    return (
      (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
      (item.address && item.address.toLowerCase().includes(lowerSearch))
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white mb-4">Cari Gedung Impian Anda</h1>
          <p className="text-blue-100 text-lg">Pesan lokasi terbaik untuk acara Anda dengan mudah dan cepat.</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-6xl mx-auto -mt-8 px-4">
        <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari nama gedung atau alamat..."
              className="w-full border-2 border-gray-100 p-3 rounded-lg focus:border-blue-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:w-1/4">
            <select
              className="w-full border-2 border-gray-100 p-3 rounded-lg focus:border-blue-500 outline-none transition-all"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Katalog Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Memuat katalog lokasi...</div>
        ) : filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLocations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://placehold.co/600x400?text=Gedung+Tersedia'
                    }}
                  />
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.category?.name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{item.address}</p>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => (window.location.href = `/reservation/${item.id}`)}
                      className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-inner border-2 border-dashed">
            <p className="text-gray-400">Wah, lokasi yang Anda cari tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
