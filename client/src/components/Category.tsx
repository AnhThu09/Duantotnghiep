import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Category {
  category_id: number
  category_name: string
  slug: string
}

export default function CategoryDropdownNavbar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('❌ Lỗi fetch danh mục:', err))
  }, [])

  return (
    <li
      className="nav-item mx-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <span
        className="nav-link text-uppercase fw-semibold text-dark"
        style={{
          fontSize: '15px',
          cursor: 'pointer',
          textDecoration: 'none',
          letterSpacing: '0.5px',
        }}
      >
        Sản phẩm
      </span>

      {isHovered && (
        <div
          className="shadow-sm rounded"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#fffefb',
            border: '1px solid #eee',
            zIndex: 999,
            width: '240px',
            padding: '12px 16px',
          }}
        >
          <ul className="list-unstyled mb-0">
            {categories.map((cat) => (
              <li key={cat.category_id} className="mb-2">
                <Link
                  to={`/danh-muc/${cat.slug}`}
                  className="d-block text-dark"
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = '#5EAB5A')
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = '#000')
                  }
                >
                  {cat.category_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
