import React, { useEffect, useState } from 'react';

interface Category {
  category_id: number;
  category_name: string;
  slug: string;
  description: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then((res) => res.json())
      .then((data: Category[]) => {
        console.log("👉 Dữ liệu nhận:", data); // Xem log này
        setCategories(data);
      })
      .catch((err) => console.error("❌ Lỗi fetch:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
      <ul className="space-y-2">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li key={cat.category_id} className="p-3 bg-gray-100 rounded">
              <h3 className="font-semibold">{cat.category_name}</h3>
              <p className="text-sm text-gray-600">{cat.description}</p>
            </li>
          ))
        ) : (
          <p>Không có danh mục nào</p>
        )}
      </ul>
    </div>
  );
}
