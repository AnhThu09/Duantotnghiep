import React, { useState } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';

interface Review {
  id: number;
  reviewer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
}

const reviewsMock: Review[] = [
  {
    id: 1,
    reviewer: 'Nguyễn Văn A',
    product: 'Son dưỡng môi',
    rating: 5,
    comment: 'Sản phẩm rất tốt, giao hàng nhanh!',
    date: '2025-06-10',
  },
  {
    id: 2,
    reviewer: 'Trần Thị B',
    product: 'Kem chống nắng',
    rating: 4,
    comment: 'Dùng ổn, sẽ mua lại.',
    date: '2025-06-11',
  },
  {
    id: 3,
    reviewer: 'Lê Văn C',
    product: 'Sữa rửa mặt',
    rating: 3,
    comment: 'Bình thường, không quá nổi bật.',
    date: '2025-06-12',
  },
];

const ReviewManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState<Review[]>(reviewsMock);

  const filteredReviews = reviews.filter((review) =>
    review.reviewer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?');
    if (confirmed) {
      setReviews(reviews.filter((review) => review.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Quản lý đánh giá</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên người đánh giá..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-l px-4 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600">
          <FaSearch />
        </button>
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3">STT</th>
              <th className="px-4 py-3">Người đánh giá</th>
              <th className="px-4 py-3">Sản phẩm</th>
              <th className="px-4 py-3">Đánh giá</th>
              <th className="px-4 py-3">Bình luận</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review, index) => (
              <tr
                key={review.id}
                className="bg-white border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{index + 1}</td>
                <td className="px-4 py-3">{review.reviewer}</td>
                <td className="px-4 py-3">{review.product}</td>
                <td className="px-4 py-3 text-yellow-500">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </td>
                <td className="px-4 py-3">{review.comment}</td>
                <td className="px-4 py-3">{review.date}</td>
                <td className="px-4 py-3">
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => handleDelete(review.id)}
                    title="Xóa đánh giá"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Không tìm thấy đánh giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewManager;
