import React, { useRef, useState, useEffect } from "react";
import Hashtags from "./Hashtags";

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const maxHeight = 2 * lineHeight;

    if (element.scrollHeight > maxHeight) {
      setClamped(true);
    }
  }, [post.content]);

  return (
    <div className="bg-white rounded-md shadow-md p-5 mb-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex space-x-4 items-center">
        <img
          src={post.avatar}
          alt="avatar"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex flex-col justify-center mt-1">
          <p className="font-medium text-gray-900 text-base">{post.name}</p>
          <p className="text-xs text-gray-500 italic mt-[-2px]">{post.date}</p>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-2 text-gray-800 mt-4">
        {post.topic}
      </h3>

      <div className="text-gray-700 text-base leading-relaxed mb-4">
        <p
          ref={contentRef}
          className={
            !expanded && clamped
              ? "line-clamp-2 transition-all duration-300"
              : "transition-all duration-300"
          }
        >
          {post.content}
        </p>
        {clamped && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-blue-600 hover:underline focus:outline-none text-sm font-semibold"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      <Hashtags tags={post.hashtags} />

      <div className="flex space-x-8 text-gray-600 text-sm mt-4">
        <button className="hover:text-blue-600 transition flex items-center gap-1">
          👍 <span>{post.likes}</span>
        </button>
        <button className="hover:text-green-600 transition flex items-center gap-1">
          💬 <span>{post.comments}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
