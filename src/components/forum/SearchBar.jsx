export default function SearchBar() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="relative">
        {/* Icon kính lúp */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi, chủ đề hoặc người dùng..."
          className="w-full pl-12 pr-24 py-4 rounded-lg border border-gray-300 bg-white shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          aria-label="Search"
        />

        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Tìm
        </button>
      </div>
    </div>
  );
}
