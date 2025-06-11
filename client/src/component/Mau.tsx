
const About = () => {
  return (
    <section className="">
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart (3)</h2>
    
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <img src="https://placehold.co/100x100" alt="Product" className="w-20 h-20 object-cover rounded-md"/>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">classNameic T-Shirt</h3>
          <p className="text-sm text-gray-500">Size: M, Color: Black</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">-</button>
          <span className="w-8 text-center">1</span>
          <button className="text-gray-500 hover:text-gray-700">+</button>
        </div>
        <p className="font-semibold text-gray-900 w-20 text-right">$49.99</p>
        <button className="text-gray-400 hover:text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <img src="https://placehold.co/100x100" alt="Product" className="w-20 h-20 object-cover rounded-md"/>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Denim Jeans</h3>
          <p className="text-sm text-gray-500">Size: 32, Color: Blue</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">-</button>
          <span className="w-8 text-center">2</span>
          <button className="text-gray-500 hover:text-gray-700">+</button>
        </div>
        <p className="font-semibold text-gray-900 w-20 text-right">$89.99</p>
        <button className="text-gray-400 hover:text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between text-base text-gray-900 mb-2">
          <p>Subtotal</p>
          <p className="font-semibold">$229.97</p>
        </div>
        <div className="flex justify-between text-base text-gray-500 mb-4">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
          <p>Total</p>
          <p>$229.97</p>
        </div>
        
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">
          Checkout
        </button>
      </div>
    </div>
  </div>
</div>
    </section>
  );
};

export default About;