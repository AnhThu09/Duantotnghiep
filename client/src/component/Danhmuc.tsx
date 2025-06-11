import React from "react";

const categories = [
  {
    name: "Sữa rửa mặt",
    image: "https://cdn.tgdd.vn/Products/Images/7540/310757/thuong-hieu-tra-hoa-cuc-200623-093030-600x600.jpg",
  },
  {
    name: "Serum",
    image: "https://cf.shopee.vn/file/16fa3e5e6691d2832f74d30f2a3a4ed0",
  },
  {
    name: "Kem dưỡng ẩm",
    image: "https://cdn.tgdd.vn/Products/Images/7540/309890/kem-duong-am-vichy-300623-105224-600x600.jpg",
  },
  {
    name: "Kem chống nắng",
    image: "https://cdn.tgdd.vn/Products/Images/7540/310759/kem-chong-nang-300623-111802-600x600.jpg",
  },
  {
    name: "Mặt nạ",
    image: "https://cdn.tgdd.vn/Products/Images/7540/310760/mat-na-300623-113502-600x600.jpg",
  },
  {
    name: "Son",
    image: "https://cdn.tgdd.vn/Products/Images/7540/310762/son-moi-300623-114738-600x600.jpg",
  },
];

const ProductCategories = () => {
  return (
    <div className="bg-[#f8f8f8] py-10 text-center">
      <h2 className="text-2xl font-semibold mb-8">Danh mục</h2>
      <div className="flex justify-center flex-wrap gap-8 d-flex">
        {categories.map((item, index) => (
          <div key={index} className="w-28">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto shadow-md">
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-2 text-sm font-medium">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
