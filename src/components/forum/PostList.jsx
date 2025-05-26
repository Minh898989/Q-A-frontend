import React from "react";
import PostCard from "./PostCard";

const PostList = ({ posts }) => {
  if (posts.length === 0) {
    return <p className="text-center text-gray-500">Không có bài viết nào</p>;
  }

  return (
    <div>
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  );
};

export default PostList;
