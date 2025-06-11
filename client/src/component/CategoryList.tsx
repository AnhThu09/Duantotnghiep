import { useEffect, useState } from "react";
import axios from "axios";

// Khai báo kiểu dữ liệu cho một danh mục
interface Category {
  category_id: number;
  category_name: string;
  slug: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get<Category[]>("http://localhost:3000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap",
      }}
    >
      {categories.map((cat: Category) => (
        <div key={cat.category_id} style={{ textAlign: "center" }}>
          <img
            src={`/images/${cat.slug}.png`}
            alt={cat.category_name}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
            }}
          />
          <p>{cat.category_name}</p>
        </div>
      ))}
    </div>
  );
}
