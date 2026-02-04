import React, { useState, useEffect } from 'react'
import Api from '../../api'

export default function Locations() {
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [idLocation, setIdLocation] = useState(null)

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [validation, setValidation] = useState({})
  const [message, setMessage] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const params = `?search=${search}&category_id=${filterCategory}`
      const response = await Api.get(`/locations${params}`)
      if (response.data && response.data.success) {
        setLocations(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const response = await Api.get('/location-categories')
      if (response.data && response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [search, filterCategory])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreviewImage(URL.createObjectURL(file))
  }

  const openAddModal = () => {
    setIsEdit(false)
    setIdLocation(null)
    setTitle('')
    setCategoryId('')
    setDescription('')
    setAddress('')
    setImage(null)
    setPreviewImage(null)
    setValidation({})
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setIsEdit(true)
    setIdLocation(item.id)
    setTitle(item.title)
    setCategoryId(item.category_id)
    setDescription(item.description)
    setAddress(item.address)
    setPreviewImage(item.image)
    setImage(null)
    setValidation({})
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('category_id', categoryId)
    formData.append('description', description)
    formData.append('address', address)
    if (image) formData.append('image', image)

    if (isEdit) formData.append('_method', 'PUT')

    try {
      const url = isEdit ? `/locations/${idLocation}` : '/locations'
      await Api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setMessage({ type: 'success', text: 'Data berhasil disimpan!' })
      setShowModal(false)
      fetchData()
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidation(error.response.data.errors)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus lokasi ini?')) return
    try {
      await Api.delete(`/locations/${id}`)
      setMessage({ type: 'success', text: 'Data berhasil dihapus!' })
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Lokasi</h2>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Tambah
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari lokasi..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
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

      {message && (
        <div
          className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center p-5">
                  Loading...
                </td>
              </tr>
            ) : (
              locations.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">
                    <img src={item.image} alt="" className="w-20 h-12 object-cover rounded" />
                  </td>
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="p-3">{item.category?.name}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => openEditModal(item)} className="text-blue-600 mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit Lokasi' : 'Tambah Lokasi'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block mb-1 font-bold">Judul</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {validation.title && <small className="text-red-500">{validation.title[0]}</small>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-bold">Kategori</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {validation.category_id && <small className="text-red-500">{validation.category_id[0]}</small>}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-bold">Alamat</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-bold">Deskripsi</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-bold">Thumbnail Gambar</label>
                <input type="file" className="w-full border p-2 rounded" onChange={handleFileChange} />
                {previewImage && (
                  <img src={previewImage} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
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
