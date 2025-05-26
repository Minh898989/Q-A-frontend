import React from 'react';

export default function CreatePost({ onCreate }) {
  return (
    <button
      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
      onClick={onCreate}
    >
      + Bài viết
    </button>
  );
}
