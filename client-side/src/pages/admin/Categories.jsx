import { useState, useEffect } from 'react'
import Api from '../../api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [idCategory, setIdCategory] = useState(null)
  const [name, setName] = useState('')

  const [validation, setValidation] = useState({})
  const [message, setMessage] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Tambahkan 's' menjadi /locations-categories
      const response = await Api.get('/locations-categories')
      if (response.data && response.data.success) {
        setCategories(response.data.data)
      } else if (Array.isArray(response.data)) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Gagal mengambil data kategori.' })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openAddModal = () => {
    setIsEdit(false)
    setIdCategory(null)
    setName('')
    setValidation({})
    setMessage(null)
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setIsEdit(true)
    setIdCategory(item.id)
    setName(item.name)
    setValidation({})
    setMessage(null)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEdit) {
        await Api.put(`/locations-categories/${idCategory}`, { name })
        setMessage({ type: 'success', text: 'Kategori berhasil diperbarui!' })
      } else {
        await Api.post('/locations-categories', { name })
        setMessage({ type: 'success', text: 'Kategori berhasil ditambahkan!' })
      }

      setShowModal(false)
      fetchData()
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidation(error.response.data.errors)
      } else {
        setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan data.' })
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return
    try {
      // Tambahkan 's' menjadi /locations-categories
      await Api.delete(`/locations-categories/${id}`)
      setMessage({ type: 'success', text: 'Kategori berhasil dihapus!' })
      fetchData()
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus kategori.' })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kategori Lokasi</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          + Tambah Kategori
        </button>
      </div>

      {message && (
        <div
          className={`p-4 mb-4 text-sm rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                No
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama Kategori
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="px-5 py-5 text-center text-sm text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{index + 1}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.name}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-5 py-5 text-center text-sm text-gray-500">
                  Belum ada data kategori.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nama Kategori</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Gedung Olahraga"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {validation.name && <p className="text-red-500 text-xs mt-1">{validation.name[0]}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
