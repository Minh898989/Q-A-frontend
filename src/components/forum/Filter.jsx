import React from 'react';

export default function Filter({ onFilter }) {
  return (
    <button
      className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      onClick={onFilter}
    >
      Lọc
    </button>
  );
}
