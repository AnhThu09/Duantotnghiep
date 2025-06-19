import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  createdAt: string;
  category: string;
  tags: string[];
  isVisible: boolean;
  imageUrl: string;
}

const mockPosts: Post[] = [
  {
    id: 8,
    title: 'Chi tiết bài viết',
    createdAt: '23/09/2021 15:08:37',
    category: '',
    tags: ['Chủ đề bài viết'],
    isVisible: true,
    imageUrl: '/images/post1.jpg',
  },
  {
    id: 7,
    title: 'Đặc điểm nhận biết rau củ quả tươi hữu ích cho các',
    createdAt: '06/09/2021 14:44:04',
    category: 'Tin mới',
    tags: ['Thông tin hữu ích'],
    isVisible: true,
    imageUrl: '/images/post2.jpg',
  },
  {
    id: 6,
    title: 'Tại sao cần phải ăn rau củ quả mỗi ngày?',
    createdAt: '06/09/2021 14:44:04',
    category: 'Tin mới',
    tags: ['Sống khỏe'],
    isVisible: true,
    imageUrl: '/images/post3.jpg',
  },
];

const PostManager = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: number) => {
    const confirm = window.confirm('Bạn có chắc muốn xoá bài viết này?');
    if (confirm) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Quản lý bài viết</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1">
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm"
          className="border px-3 py-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-gray-300 px-4 py-2 rounded flex items-center">
          <Search size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">STT</th>
              <th className="border p-2">Tiêu đề</th>
              <th className="border p-2">Đặc điểm</th>
              <th className="border p-2">Hiển thị</th>
              <th className="border p-2">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr key={post.id} className="border-t">
                <td className="border p-2 text-center">{post.id}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <img src={post.imageUrl} alt="thumb" className="w-14 h-10 object-cover" />
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-gray-500 text-xs">Ngày tạo: {post.createdAt}</div>
                    </div>
                  </div>
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={post.category}
                    readOnly
                    className="border px-2 py-1 w-full mb-1"
                  />
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs inline-block mr-1"
                    >
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="border p-2 text-center">
                  <input type="checkbox" checked={post.isVisible} readOnly />
                </td>
                <td className="border p-2 text-center">
                  <button className="text-blue-600 hover:underline mr-2">
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostManager;
