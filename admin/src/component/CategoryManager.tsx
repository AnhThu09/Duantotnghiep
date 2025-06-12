// CategoryManager.tsx
import React, { useEffect, useState } from 'react';

interface Category {
  category_id: number;
  category_name: string;
  slug: string;
  description: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ category_name: '', slug: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = () => {
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Lỗi khi tải danh mục:', err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const url = editingId
      ? `http://localhost:3000/api/categories/update/${editingId}`
      : 'http://localhost:3000/api/categories/add';

    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(() => {
        fetchCategories();
        setFormData({ category_name: '', slug: '', description: '' });
        setEditingId(null);
      })
      .catch((err) => console.error('Lỗi:', err));
  };

  const handleEdit = (cat: Category) => {
    setFormData({ category_name: cat.category_name, slug: cat.slug, description: cat.description });
    setEditingId(cat.category_id);
  };

  const handleDelete = (id: number) => {
    if (confirm('Xác nhận xoá danh mục này?')) {
      fetch(`http://localhost:3000/api/categories/delete/${id}`, { method: 'DELETE' })
        .then(() => fetchCategories())
        .catch(err => console.error('Lỗi xoá:', err));
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quản lý danh mục</h2>

      {/* Form */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Tên danh mục"
          name="category_name"
          value={formData.category_name}
          onChange={handleChange}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
        />
        <textarea
          className="w-full mb-2 p-2 border rounded"
          placeholder="Mô tả"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          {editingId ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>

      {/* Danh sách */}
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.category_id} className="p-4 bg-white shadow rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{cat.category_name}</h3>
              <p className="text-sm text-gray-600">{cat.description}</p>
            </div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                onClick={() => handleEdit(cat)}
              >
                Sửa
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(cat.category_id)}
              >
                Xoá
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
