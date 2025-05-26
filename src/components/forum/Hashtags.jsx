import React from "react";

const Hashtags = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

export default Hashtags;
