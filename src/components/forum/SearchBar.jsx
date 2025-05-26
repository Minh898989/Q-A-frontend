import React from 'react';

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="relative w-full">
      {/* Icon kính lúp */}
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1112 4.5a7.5 7.5 0 014.65 12.15z"
        />
      </svg>

      <input
        type="text"
        placeholder="Tìm bài viết, chủ đề..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-md px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
    </div>
  );
}
